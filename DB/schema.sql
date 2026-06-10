-- 1. ������ ���� ������
/*IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'InstrumentsDB')
BEGIN
    CREATE DATABASE InstrumentsDB;
END
GO

USE InstrumentsDB;
GO*/


-- 2. �������� ������ (4 �����)

-- ������� 1: ������������
/*CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) UNIQUE NOT NULL,
    age INT CHECK (age >= 0 AND age <= 150),
    role NVARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'operator', 'viewer')),
    created_at DATETIME DEFAULT GETDATE()
);
GO*/

/*-- ������� 2: ��������� ������������
CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) UNIQUE NOT NULL,
    description NVARCHAR(MAX)
);
GO*/

-- ������� 3: �����������
/*CREATE TABLE tools (
    id INT IDENTITY(1,1) PRIMARY KEY,
    inventory_number NVARCHAR(50) UNIQUE NOT NULL,
    name NVARCHAR(150) NOT NULL,
    category_id INT FOREIGN KEY REFERENCES categories(id) ON DELETE NO ACTION,
    status NVARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'issued', 'maintenance', 'written_off')),
    purchase_date DATE,
    condition_score INT CHECK (condition_score BETWEEN 1 AND 5),
    created_at DATETIME DEFAULT GETDATE()
);
GO*/

-- ������� 4: ������ ������������
/*CREATE TABLE assignments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tool_id INT FOREIGN KEY REFERENCES tools(id) ON DELETE NO ACTION,
    user_id INT FOREIGN KEY REFERENCES users(id) ON DELETE NO ACTION,
    issued_at DATETIME DEFAULT GETDATE(),
    returned_at DATETIME NULL,
    notes NVARCHAR(MAX)
);
GO*/

-- ������� ����� (��� ��������)
/*CREATE TABLE audit_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    table_name NVARCHAR(50),
    record_id INT,
    old_status NVARCHAR(20),
    new_status NVARCHAR(20),
    changed_at DATETIME DEFAULT GETDATE()
);
GO*/

-- 3. ������������� (3 �����)

/*CREATE VIEW v_available_tools AS
SELECT 
    t.id, 
    t.inventory_number, 
    t.name, 
    c.name AS category_name, 
    t.condition_score
FROM tools t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status = 'available';
GO*/

/*CREATE VIEW v_active_assignments AS
SELECT 
    a.id, 
    t.inventory_number, 
    t.name AS tool_name, 
    u.name AS user_name,
    u.email AS user_email,
    a.issued_at, 
    a.notes
FROM assignments a
JOIN tools t ON a.tool_id = t.id
JOIN users u ON a.user_id = u.id
WHERE a.returned_at IS NULL;
GO*/

/*CREATE VIEW v_category_statistics AS
SELECT 
    c.name AS category, 
    COUNT(t.id) AS total_count,
    COUNT(CASE WHEN t.status = 'available' THEN 1 END) AS available_count,
    COUNT(CASE WHEN t.status = 'issued' THEN 1 END) AS issued_count
FROM categories c
LEFT JOIN tools t ON c.id = t.category_id
GROUP BY c.name;
GO*/

-- 4. ������� (3 �����)


/*CREATE FUNCTION fn_is_tool_available(@tool_id INT)
RETURNS BIT
AS
BEGIN
    DECLARE @status NVARCHAR(20);
    SELECT @status = status FROM tools WHERE id = @tool_id;
    IF @status = 'available' RETURN 1;
    RETURN 0;
END;
GO*/

/*CREATE FUNCTION fn_get_user_active_tools(@user_id INT)
RETURNS TABLE
AS
RETURN (
    SELECT t.name AS tool_name, t.inventory_number, a.issued_at
    FROM assignments a 
    JOIN tools t ON a.tool_id = t.id 
    WHERE a.user_id = @user_id AND a.returned_at IS NULL
);
GO*/

/*CREATE FUNCTION fn_calculate_tool_age_years(@purchase_date DATE)
RETURNS INT
AS
BEGIN
    RETURN DATEDIFF(YEAR, @purchase_date, GETDATE());
END;
GO*/


-- 5. �������� ��������� (3 �����)

/*CREATE PROCEDURE sp_issue_tool
    @tool_id INT, 
    @user_id INT, 
    @notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF dbo.fn_is_tool_available(@tool_id) = 0
    BEGIN
        RAISERROR('Instrument is not available for issue', 16, 1);
        RETURN;
    END;
    
    INSERT INTO assignments (tool_id, user_id, notes) 
    VALUES (@tool_id, @user_id, @notes);
    
    UPDATE tools SET status = 'issued' WHERE id = @tool_id;
END;
GO*/

/*CREATE PROCEDURE sp_return_tool
    @assignment_id INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @tool_id INT;
    
    UPDATE assignments 
    SET returned_at = GETDATE() 
    WHERE id = @assignment_id AND returned_at IS NULL;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Assignment not found or already returned', 16, 1);
        RETURN;
    END;
    
    SELECT @tool_id = tool_id FROM assignments WHERE id = @assignment_id;
    UPDATE tools SET status = 'available' WHERE id = @tool_id;
END;
GO*/

/*CREATE PROCEDURE sp_archive_tool
    @tool_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF (SELECT COUNT(*) FROM assignments 
        WHERE tool_id = @tool_id AND returned_at IS NULL) > 0
    BEGIN
        RAISERROR('Cannot archive issued instrument', 16, 1);
        RETURN;
    END;
    
    UPDATE tools SET status = 'written_off' WHERE id = @tool_id;
END;
GO*/

-- 6. �������� (3 �����)


/*CREATE TRIGGER trg_validate_user_age
ON users
INSTEAD OF INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM inserted WHERE age IS NOT NULL AND age < 16)
    BEGIN
        RAISERROR('User age must be at least 16 years', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
    
    INSERT INTO users (name, email, age, role)
    SELECT name, email, age, ISNULL(role, 'viewer')
    FROM inserted
    WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = inserted.id);
    
    UPDATE u SET 
        u.name = i.name,
        u.email = i.email,
        u.age = i.age,
        u.role = ISNULL(i.role, u.role)
    FROM users u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO*/

/*CREATE TRIGGER trg_tool_status_log
ON tools
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF UPDATE(status)
    BEGIN
        INSERT INTO audit_log (table_name, record_id, old_status, new_status)
        SELECT 'tools', d.id, d.status, i.status
        FROM deleted d
        INNER JOIN inserted i ON d.id = i.id
        WHERE d.status <> i.status;
    END;
END;
GO

CREATE TRIGGER trg_prevent_double_issue
ON assignments
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (
        SELECT 1 FROM inserted i
        INNER JOIN tools t ON i.tool_id = t.id
        WHERE t.status <> 'available'
    )
    BEGIN
        RAISERROR('Tool is already issued to another user', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
    
    INSERT INTO assignments (tool_id, user_id, notes)
    SELECT tool_id, user_id, notes FROM inserted;
    
    UPDATE t SET status = 'issued'
    FROM tools t
    INNER JOIN inserted i ON t.id = i.tool_id;
END;
GO*/


-- 7. �������� ������

/*INSERT INTO users (name, email, age, role) VALUES
(N'������ ���� ��������', N'ivanov@test.ru', 25, N'admin'),
(N'������ ϸ�� ��������', N'petrov@test.ru', 30, N'operator'),
(N'�������� ���� ������������', N'sidorova@test.ru', 28, N'viewer');
GO

INSERT INTO categories (name, description) VALUES
(N'������ ����������', N'�������, �������, �����'),
(N'�����������������', N'�����, ����������, ��������'),
(N'������������� ����������', N'�������, ��������������');
GO

INSERT INTO tools (inventory_number, name, category_id, status, purchase_date, condition_score) VALUES
(N'INV-001', N'������� ���������', 1, N'available', '2023-01-15', 5),
(N'INV-002', N'����� �������������', 2, N'available', '2022-05-20', 4),
(N'INV-003', N'��������������', 3, N'available', '2023-03-10', 5);
GO*/