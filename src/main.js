module.exports = {
    main: () => {
        const testAddon = require('../build/Release/testaddon.node');
        console.log('addon', testAddon);
        module.exports = testAddon;

        console.log(testAddon.hello())
        console.log(testAddon.add(5, 10))
    }
}