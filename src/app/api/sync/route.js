export async function POST(request) {
    try{
        const body =  await request.json();
        console.log("Recieved CRM sync data: ", body);
    
        //validate during real time sync
    
        return new Response(JSON.stringify({status: "success", message:"Synced!"}),{
            status: 200,
            headers:{
                "Content-Type": "application/json",
            }
        })
    } catch(err){
        console.error("Sync Error:", err);
        return new Response(JSON.stringify({
            status: "error",
            message: "Failed to sync"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}