export async function GET() {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2KXpX8_6FUj3Ks77B6WNJrw2QJlQnt0WWPSk2U6V1z8a1G5rwEnKNBqrnmT_9HZCoy5uREiZrs9uA/pub?gid=1596920951&single=true&output=csv";
    
    const response = await fetch(csvUrl);
    const text = await response.text();
    
    return new Response(text, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  }