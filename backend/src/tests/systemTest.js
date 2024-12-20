const { sequelize } = require('../models');
const logger = require('../utils/logger');

async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        logger.info('Database connection has been established successfully.');
        return true;
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        return false;
    }
}

async function testModels() {
    const models = sequelize.models;
    logger.info('Testing models:', Object.keys(models));
    
    for (const [modelName, Model] of Object.entries(models)) {
        try {
            await Model.findOne();
            logger.info(`Model ${modelName} is working correctly`);
        } catch (error) {
            logger.error(`Error testing model ${modelName}:`, error);
            return false;
        }
    }
    return true;
}

async function runSystemTests() {
    logger.info('Starting system tests...');

    // Test database connection
    logger.info('Testing database connection...');
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
        logger.error('Database connection test failed');
        return false;
    }

    // Test models
    logger.info('Testing models...');
    const modelsWorking = await testModels();
    if (!modelsWorking) {
        logger.error('Models test failed');
        return false;
    }

    // Test required dependencies
    const requiredDependencies = [
        'express',
        'sequelize',
        'jsonwebtoken',
        'bcryptjs',
        'winston',
        'uuid'
    ];

    logger.info('Testing required dependencies...');
    for (const dep of requiredDependencies) {
        try {
            require(dep);
            logger.info(`Dependency ${dep} is available`);
        } catch (error) {
            logger.error(`Missing dependency: ${dep}`);
            return false;
        }
    }

    logger.info('All system tests completed successfully');
    return true;
}

// Run tests if this file is run directly
if (require.main === module) {
    runSystemTests()
        .then(success => {
            if (!success) {
                logger.error('System tests failed');
                process.exit(1);
            }
            logger.info('System tests passed');
            process.exit(0);
        })
        .catch(error => {
            logger.error('Unexpected error during system tests:', error);
            process.exit(1);
        });
}

module.exports = {
    testDatabaseConnection,
    testModels,
    runSystemTests
};
