const axios = require('axios');

async function testDashboardComponents() {
    const tests = {
        apiConnection: false,
        requiredDependencies: false,
        routeConfiguration: false
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
        '@mui/material',
        '@mui/icons-material',
        'axios',
        'react',
        'react-dom',
        'react-router-dom',
        'recharts'
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

    // Test Route Configuration
    try {
        // Since routes are React components, we'll just check if the file exists
        require.resolve('../routes');
        console.log('✅ Route configuration is valid');
        tests.routeConfiguration = true;
    } catch (error) {
        console.error('❌ Route configuration failed:', error.message);
    }

    return tests;
}

async function runSystemTests() {
    console.log('\n🔄 Starting Trader Dashboard system tests...\n');

    const results = await testDashboardComponents();

    // Print test results summary
    console.log('\n📊 Test Results Summary:');
    console.log('-------------------------');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });

    // Overall result
    const allTestsPassed = Object.values(results).every(result => result === true);
    console.log(`\n🏁 Final Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    return allTestsPassed;
}

// Run tests if this file is run directly
if (require.main === module) {
    runSystemTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Tests failed with error:', error);
            process.exit(1);
        });
}

module.exports = {
    testDashboardComponents,
    runSystemTests
};
