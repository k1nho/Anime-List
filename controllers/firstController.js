exports.firstController = (req,res) =>{
    const animePlatforms = [
        {"name": "Funimation" , "img" :  "https://yt3.ggpht.com/ytc/AAUvwnifhb-IyHDQx4LyJnyxphGPAgWLcWU-Q9PNuBXySEo=s900-c-k-c0x00ffffff-no-rj" , "id" : "9393"} , 
        {"name" : "Crunchyroll" , "img": "https://yt3.ggpht.com/ytc/AAUvwnhdkAlH4XmfuK5IKNh1jdDurzLCHMN2guZeU65uEg=s900-c-k-c0x00ffffff-no-rj" , "id" : "42e2" },
        {"name": "HiDive" , "img" : "https://yt3.ggpht.com/ytc/AAUvwng4BABywrEB4PF7zOJ9Ch1OMfT0AaxsNlnVeGva=s900-c-k-c0x00ffffff-no-rj" , "id" : "4782"},
        {"name": "Netflix" , "img": "https://lhsstatesman.com/wp-content/uploads/2019/05/netflix-900x900.png", "id": "7372"}
    ]
    res.end(JSON.stringify(animePlatforms));
}