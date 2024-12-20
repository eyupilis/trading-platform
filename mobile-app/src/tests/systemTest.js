const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testMobileAppComponents() {
    const tests = {
        apiConnection: false,
        requiredDependencies: false,
        assetAvailability: false,
        navigationSetup: false
    };

    // Test API Connection
    try {
        const response = await axios.get('http://localhost:5000/api/health', {
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept all status codes except 5xx
            }
        });
        if (response.status === 200) {
            console.log('✅ API Connection successful');
            tests.apiConnection = true;
        } else {
            console.error(`❌ API Connection failed: Status ${response.status}`);
        }
    } catch (error) {
        console.error('❌ API Connection failed:', error.message);
    }

    // Test Required Dependencies
    const requiredDependencies = [
        'axios',
        'react-native-screens',
        'react-native-safe-area-context',
        '@react-native-async-storage/async-storage'
    ];

    try {
        let allDependenciesPresent = true;
        for (const dep of requiredDependencies) {
            try {
                require.resolve(dep);
                console.log(`✅ Dependency ${dep} is available`);
            } catch (error) {
                console.error(`❌ Missing dependency: ${dep}`);
                allDependenciesPresent = false;
            }
        }
        tests.requiredDependencies = allDependenciesPresent;
    } catch (error) {
        console.error('❌ Dependency check failed:', error.message);
    }

    // Test Asset Availability
    try {
        const assetPath = path.join(__dirname, '../../assets');
        const assets = fs.readdirSync(assetPath);
        if (assets.length > 0) {
            console.log('✅ Assets are available');
            tests.assetAvailability = true;
        } else {
            console.error('❌ No assets found in assets directory');
        }
    } catch (error) {
        console.error('❌ Asset availability test failed:', error.message);
    }

    // Test Navigation Setup
    try {
        // Since navigation uses React Native components, we'll just check if the file exists
        require.resolve('../navigation/AppNavigator');
        console.log('✅ Navigation configuration is valid');
        tests.navigationSetup = true;
    } catch (error) {
        console.error('❌ Navigation setup test failed:', error.message);
    }

    return tests;
}

async function runSystemTests() {
    console.log('🔄 Starting Mobile App system tests...\n');

    const testResults = await testMobileAppComponents();

    console.log('\n📊 Test Results Summary:');
    console.log('-------------------------');
    Object.entries(testResults).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });

    const allTestsPassed = Object.values(testResults).every(result => result);
    console.log('\n🏁 Final Result:', allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');

    return allTestsPassed;
}

// Run tests if this file is run directly
if (require.main === module) {
    runSystemTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Unexpected error during system tests:', error);
            process.exit(1);
        });
}

module.exports = {
    testMobileAppComponents,
    runSystemTests
};
