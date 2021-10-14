const cppAddon = require('../build/Release/testaddon.node');

test(`Sample test`, () => {
    expect(cppAddon.add(2, 2)).toBe(4);
})