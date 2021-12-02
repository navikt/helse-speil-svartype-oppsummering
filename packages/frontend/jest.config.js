module.exports = {
    preset: 'ts-jest',
    moduleFileExtensions: ['js', 'jsx', 'json', 'tsx', 'ts'],
    transform: {
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'babel-jest',
        '^.+\\.js$': 'babel-jest',
        '^.+\\.jsx$': 'babel-jest',
        '^.+\\.tsx$': 'ts-jest',
        '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
        'nav-(.*)-style': '<rootDir>/__mocks__/fileMock.js',
        'test-data': '<rootDir>/test/data',
        '@navikt/ds-icons(.*)': '@navikt/ds-icons/cjs$1',
        '@navikt/ds-react(.*)': '@navikt/ds-react/cjs$1',
        '@navikt/ds-css(.*)': '<rootDir>/__mocks__/styleMock.js',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules'],
    watchPathIgnorePatterns: ['<rootDir>/node_modules'],
    setupFilesAfterEnv: ['<rootDir>/__mocks__/jest-setup.js'],
};
process.env.TZ = 'UTC';