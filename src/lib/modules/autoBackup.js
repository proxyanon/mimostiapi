
/**
 * 
 * @author Daniel Victor Freire Feitosa
 * @version 2.0.3
 * @date 2025-06-08
 * @since 2024-01-01
 * @abstract - This module provides functionality to automatically create backups
 * of data in a Sequelize model whenever an update or deletion occurs.
 * @module autoBackup
 * @package sequelize, autoBackup
 * @requires sequelize
 * @exports autoBackup
 * @async - This function sets up automatic backups for a given model.
 * @description - This function listens for updates and deletions on the specified model
 * and creates a backup of the data whenever an update or deletion occurs.
 * @typedef {BackupModule} autoBackup
 * @type {BackupModule} - autoBackup
 * @property {Function} run - The function that sets up the automatic backup functionality.
 *     @param {string} modelName - The name of the Sequelize model to set up backups for.
 * @property {Object} sequelize - The Sequelize instance used for database operations.
 */

const fs = require('fs');
const path = require('path');
const config = require('../../config');
const Security = require('./Security');

class autoBackup {
    /** * @constructor
     * @param {Object} sequelize - The Sequelize instance used for database operations.
     * @param {boolean} verbose - Whether to log messages to the console.
     * @param {boolean} saveInFile - Whether to save the backup in a file.
     * @param {string} bkp_filename - The name of the backup file.
     * @description - Initializes the autoBackup module with the provided Sequelize instance,
     * verbose logging option, file saving option, and backup filename.
     * @throws {Exception} - Throws an exception if the model is not found in the Sequelize instance.
     * @example
     * const { createBackup } = require('./autoBackup');
     * const sequelize = require('./database'); // Assuming you have a Sequelize instance
     * const backup = new createBackup(sequelize, true, true, 'backup.json');
     * backup.run('YourModelName');
     * @returns {void}
     * @memberof autoBackup
    */
    
    constructor(sequelize, verbose=true, saveInFile=true) {
        this.verbose = verbose;
        this.sequelize = sequelize;
        this.saveInFile = saveInFile;
        this.bkp_path = config.mysql.backup_path;
        this.bkp_filename = config.mysql.backup_filename || `backup_${(new Date).toTimeString()}_${Security.makeid(5)}.sql`;
        this.bkp_fullpath = `${this.bkp_path}${this.bkp_filename}`;
    }

    static getDateTime() {
            
        let thisDate = new Date();

        let M = thisDate.getMonth() + 1;
        let d = thisDate.getDate();
        let y = thisDate.getFullYear();
        
        M = M < 10 ? `0${M}` : M;
        d = d < 10 ? `0${d}` : d;
            
        let dmy = `${d}/${M}/${y}`;
        
        let h = thisDate.getHours();
        let m = thisDate.getMinutes();
        let s = thisDate.getSeconds();

        let hms = `${h}:${m}:${s}`;

        return { dmy, hms };

    }
    
    async run(modelName) {

        for(key in this.sequelize.models) {
            
            typeof this.sequelize.models[key] !== 'string' ? null : this.verbose ? console.log(`Model ${key} found in Sequelize instance.`) : null;

            const model = this.sequelize.models[modelName];

            if(!model) {
                this.verbose ? function thexcept(){throw new Exception(`Model ${modelName} not found in Sequelize instance.`)}() : null;
            }

            model.afterCreate(async (instance) => {
                
                const { dmy, hms } = this.getDateTime();

                this.verbose ? console.log(`Create record in ${modelName} with data ${instance.dataValues}`) : null;
                this.verbose ? console.log(`${dmy} - ${hms} Create record in ${modelName} with data ${instance.dataValues}`) : null;
                
                await this.crateBackup(modelName, instance.dataValues, 'update');

            });

            model.afterUpadate(async (instance) => {
                this.verbose ? console.log(`${dmy} - ${hms} Update record in ${modelName} with data ${instance.dataValues}`) : null;
                await this.crateBackup(modelName, instance.dataValues, 'delete');
            });

            model.afterDestroy(async (instance) => {
                    this.verbose ? console.log(`${dmy} - ${hms} Delete record in ${modelName}`) : null;
                    await this.crateBackup(modelName, instance.dataValues, 'delete');
            });

        }

    }

    write_backup(modelName, data) {
        
        try{
            const backupDir = path.dirname(this.bkp_fullpath);
            
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }

            fs.writeFileSync(this.bkp_fullpath, JSON.stringify(data, null, 2), 'utf8');

            this.verbose ? console.log(`${this.getDateTime} Backup for model ${modelName} saved to ${this.bkp_fullpath}`) : function thexcept(){throw new Exception(`Backup for model ${modelName} saved to ${this.bkp_fullpath}`)};

        } catch (error) {
            this.verbose ? function thexcept(){throw new Exception(`Error writing backup for model ${modelName}:`, `${str(error)}`)}() : null;
        }

    }

    async main(modelName=undefined) {
        try {
            await this.run(modelName);
            this.verbose ? console.log(`${this.getDateTime()} Auto backup for model ${modelName} is running.`) : null;
        } catch (error) {
            this.verbose ? function thexcept(){throw new Exception(`Error setting up auto backup for model ${modelName}:`, `${str(error)}`)}() : null;
        }
    }
}

module.exports = autoBackup;