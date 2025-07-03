const Exception = Error; // For test compatibility
const dateTime = require('.\\..\\utils\\dateTime'); // Adjust the path as necessary
const mockDateTime = dateTime.getDateTime();s

describe('autoBackup.run', () => {
    let autoBackup;
    let mockModel;
    let crateBackupMock;
    let consoleLogSpy;

    beforeEach(() => {
        // Arrange
        crateBackupMock = jest.fn().mockResolvedValue(undefined);
        mockModel = {
            afterCreate: jest.fn((cb) => { mockModel._afterCreate = cb; }),
            afterUpadate: jest.fn((cb) => { mockModel._afterUpadate = cb; }),
            afterDestroy: jest.fn((cb) => { mockModel._afterDestroy = cb; }),
        };
        autoBackup = {
            sequelize: { models: { TestModel: mockModel } },
            crateBackup: crateBackupMock,
            getDateTime: jest.fn(() => mockDateTime),
            verbose: true,
        };
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should attach hooks and call crateBackup on afterCreate, afterUpadate, afterDestroy (happy path, verbose)', async () => {

        // Act
        await autoBackup.run('TestModel');

        // Assert
        expect(mockModel.afterCreate).toHaveBeenCalledTimes(1);
        expect(mockModel.afterUpadate).toHaveBeenCalledTimes(1);
        expect(mockModel.afterDestroy).toHaveBeenCalledTimes(1);

        // Act
        const instance = { dataValues: { id: 1, name: 'foo' } };
        await mockModel._afterCreate(instance);

        // Assert
        expect(autoBackup.getDateTime).toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith(
            `Create record in TestModel with data ${instance.dataValues}`
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
            `${mockDateTime.dmy} - ${mockDateTime.hms} Create record in TestModel with data ${instance.dataValues}`
        );
        expect(crateBackupMock).toHaveBeenCalledWith('TestModel', instance.dataValues, 'update');

        // Act
        await mockModel._afterUpadate(instance);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
            `${mockDateTime.dmy} - ${mockDateTime.hms} Update record in TestModel with data ${instance.dataValues}`
        );
        expect(crateBackupMock).toHaveBeenCalledWith('TestModel', instance.dataValues, 'delete');

        // Act
        await mockModel._afterDestroy(instance);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
            `${mockDateTime.dmy} - ${mockDateTime.hms} Delete record in TestModel`
        );
        expect(crateBackupMock).toHaveBeenCalledWith('TestModel', instance.dataValues, 'delete');
    });

    test('should not log if verbose is false', async () => {

        // Arrange
        autoBackup.verbose = false;

        // Act
        await autoBackup.run('TestModel');
        const instance = { dataValues: { id: 2 } };
        await mockModel._afterCreate(instance);
        await mockModel._afterUpadate(instance);
        await mockModel._afterDestroy(instance);

        // Assert
        expect(consoleLogSpy).not.toHaveBeenCalled();
        expect(crateBackupMock).toHaveBeenCalledTimes(3);
    });

    test('should throw Exception if model not found and verbose is true', async () => {

        // Arrange
        autoBackup.sequelize.models = {};

        // Act & Assert
        expect(() => autoBackup.run('MissingModel')).toThrow(Exception);
    });

    test('should not throw if model not found and verbose is false', async () => {

        // Arrange
        autoBackup.sequelize.models = {};
        autoBackup.verbose = false;

        // Act & Assert
        expect(() => autoBackup.run('MissingModel')).not.toThrow();
    });

    test('should handle multiple models in sequelize.models', async () => {

        // Arrange
        const AnotherModel = {
            afterCreate: jest.fn(),
            afterUpadate: jest.fn(),
            afterDestroy: jest.fn(),
        };
        autoBackup.sequelize.models = {
            TestModel: mockModel,
            AnotherModel,
        };

        // Act
        await autoBackup.run('TestModel');

        // Assert
        expect(mockModel.afterCreate).toHaveBeenCalled();
        expect(AnotherModel.afterCreate).not.toHaveBeenCalled();
    });

    test('should handle instance.dataValues being undefined', async () => {

        // Act
        await autoBackup.run('TestModel');
        const instance = {};
        await mockModel._afterCreate(instance);

        // Assert
        expect(crateBackupMock).toHaveBeenCalledWith('TestModel', undefined, 'update');
    });

    test('should not fail if crateBackup rejects', async () => {

        // Arrange
        crateBackupMock.mockRejectedValueOnce(new Error('fail'));

        // Act
        await autoBackup.run('TestModel');
        const instance = { dataValues: { id: 3 } };

        // Assert
        await expect(mockModel._afterCreate(instance)).rejects.toThrow('fail');
    });
});