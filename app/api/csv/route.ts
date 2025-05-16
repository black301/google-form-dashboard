export async function GET() {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2KXpX8_6FUj3Ks77B6WNJrw2QJlQnt0WWPSk2U6V1z8a1G5rwEnKNBqrnmT_9HZCoy5uREiZrs9uA/pub?gid=1596920951&single=true&output=csv"
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        
        return new Response(text, {
            headers: {
                'Content-Type': 'text/csv',
            },
        });
    } catch (error) {
        console.error('Error fetching CSV:', error);
        return new Response('Failed to fetch CSV', { status: 500 });
    }
}