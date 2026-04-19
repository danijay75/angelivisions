fetch("https://docs.google.com/forms/d/e/1FAIpQLSeBYlctrWnUKcRo8Cwg0hCwM7SrCV_Xd6AlXp1biEOGQQX7-g/viewform")
  .then(async res => {
    const text = await res.text()
    const titleMatch = text.match(/<title>(.*?)<\/title>/);
    console.log("Title:", titleMatch ? titleMatch[1] : "No title");
    
    if (text.includes('data-requires-login="true"')) {
       console.log("Requires login explicit attribute found");
    }
    const bodyContent = text.replace(/<[^>]*>?/gm, '');
    console.log("Extracted text snippet:", bodyContent.substring(0, 500));
  })
