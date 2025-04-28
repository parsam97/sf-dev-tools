export function getMockRestResponse(url, { method = 'GET', body } = {}) {
    const urlObj = new URL(url, 'https://mock.salesforce.com');
    const path = urlObj.pathname.replace(/\/+$/, ''); // remove any trailing slashes
    const query = Object.fromEntries(urlObj.searchParams.entries());

    if (!path.startsWith('/services/data')) {
        throw new Error(`Unknown Salesforce API path: ${path}`);
    }

    switch (true) {
        case path.endsWith('/query'):
            return mockQuery(query.q);

        case path.endsWith('/sobjects'):
            return mockSObjects(method, body);

        case path.endsWith('/sobjects/Account'):
            return mockAccountObject(method, body);

        default:
            throw new Error(`No mock implemented for ${method} ${path}`);
    }
}

// Separate mock functions
function mockQuery(soql) {
    console.log('Mocking SOQL:', soql);
    let return_body = { totalSize: 0, done: true, records: [] }
    let return_success = true

    if (soql.includes('Account')) {
        return_body = {
            totalSize: 2,
            done: true,
            records: [
                { Id: '001mock1', Name: 'Mock Account 1' },
                { Id: '001mock2', Name: 'Mock Account 2' }
            ]
        };
    }

    return {
        body: return_body,
        success: return_success,
    };
}

import sobjectsDescribeMock from '@mock/sobjectsDescribeMock.json';
function mockSObjects(method, body) {
    if (method === 'GET') {
        return sobjectsDescribeMock;
    }

    throw new Error(`Mock for method ${method} on SObjects not implemented`);
}

function mockAccountObject(method, body) {
    if (method === 'POST') {
        return { id: '001mock3', success: true, errors: [] };
    }
    if (method === 'GET') {
        return { Id: '001mock1', Name: 'Mock Account 1' };
    }
    throw new Error(`Mock for method ${method} on Account not implemented`);
}
