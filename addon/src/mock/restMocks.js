export function getMockRestResponse(url, { method = 'GET', body } = {}) {
    const urlObj = new URL(url, 'https://mock.salesforce.com');
    const path = urlObj.pathname;
    const query = Object.fromEntries(urlObj.searchParams.entries());

    // Example simple matching
    if (path.startsWith('/services/data') && path.includes('/query')) {
        return mockQuery(query.q);
    }

    if (path.startsWith('/services/data') && path.includes('/sobjects/Account')) {
        return mockAccountObject(method, body);
    }

    throw new Error(`No mock implemented for ${method} ${path}`);
}

// Separate mock functions
function mockQuery(soql) {
    console.log('Mocking SOQL:', soql);

    if (soql.includes('Account')) {
        return {
            totalSize: 2,
            done: true,
            records: [
                { Id: '001mock1', Name: 'Mock Account 1' },
                { Id: '001mock2', Name: 'Mock Account 2' }
            ]
        };
    }

    return { totalSize: 0, done: true, records: [] };
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
