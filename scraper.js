const fiverr= 'https://www.fiverr.com/';
const queryParams='search/gigs?query=';
const inputField = document.querySelector('#input');
const submit = document.querySelector('#submit');
const res=document.querySelector('#responseField');
const links=document.querySelector('#links');
const downloadingbuttons=document.querySelector('#buttons');
const download=document.querySelector('#download-button');
const jsondiv=document.querySelector('#json-div');


const myRe=/<div class="gig-card-layout"><(.|\n)*?><\/footer>(<\/div>){2}/g;
const titleRe2= /title="I will(.|\n)*?"/g;
const titleRe=/"I will (.|\n)*?"/g;
const usernameRe=/class="text-semi-bold" (.|\n)*?>(.|\n)*?<\/a>/g;
const usnameRe=/>\w+/g;

const levelRe=/(Level \d Seller)|(top-rated-seller)/g;
const startingRe=/\w\w\w\s\d*,\d\d\d/g;
const ordersRe=/<!-- -->\d(\d|\w)+/g;


const usernames=[];
const usname=[];
const title=[];
const rating=[];
const level=[];
const starting=[];
const orders=[];
const ordernum=[];
const price=[];



const getidea = async () => {
  const wordQuery = inputField.value;
  const endpoint = `${fiverr}${queryParams}${wordQuery}`;
  try {
    const response = await fetch(endpoint);
    if(response.ok){
      const webpage = await response.text();
      links.innerHTML=`<a href="${endpoint}" target="blank">Link</a>`;
     
      const gigs=webpage.match(myRe);
      console.log(gigs);

      for (let i = 0; i < gigs.length; i++) {
        title[i]=gigs[i].match(titleRe);
        level[i]=gigs[i].match(levelRe);
        if(level[i]===null){
          level[i]="No Level";
        }
        starting[i]=gigs[i].match(startingRe);
        const stringsyntax= starting[i].toString();
        price[i]=stringsyntax.replace(","," ");


        orders[i]=gigs[i].match(ordersRe);
        if(orders[i]===null){
          orders[i]="No Order";
        }
        else{
          const orderreplace=orders[i].toString();
        ordernum[i]=orderreplace.replace("<!-- -->","");
        }
        

        usernames[i]=gigs[i].match(usernameRe);
        const userstring=usernames[i].toString();
        usname[i]=userstring.match(usnameRe);

      }
     

      //toJSON
      let gigdataall=[];
      for (let i = 0; i < gigs.length; i++) {
      let gigdata={
        id: i+1,
        username: usname[i],
        gigtitle: title[i],
        leveloffreelancer : level[i],
        price: price[i],
        ordersdone:ordernum[i]
      };
      gigdataall.push(gigdata);
  
      }
      let jsonData = {
        gigdataall: gigdataall
      };
      let jsonString=JSON.stringify(jsonData);
      console.log(jsonString);
      
//JSON to csv
      let csvData = "Username,Title,Level,Price,Orders\n";

      gigdataall.forEach(function(row) {
      csvData += row.username + "," + row.gigtitle + "," + row.leveloffreelancer + "," + row.price + "," + row.ordersdone +  "\n";
    });


//To download csv
function downloadcsv(){
const encodedUri = encodeURI(csvData);
const link = document.createElement("a");
link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
link.setAttribute("download", "data.csv");
document.body.appendChild(link); // Required for FF
link.click();
}

download.addEventListener('click',downloadcsv);

//To download json
function donwloadjson(){
  const encodedUri = encodeURI(jsonString);
const link = document.createElement("a");
link.setAttribute("href", "data:text/json;charset=utf-8," + encodedUri);
link.setAttribute("download", "data.json");
document.body.appendChild(link); // Required for FF
link.click();
}
jsondiv.addEventListener('click',donwloadjson);
    }
  } catch (error) {
    console.log(error);
  }
}
submit.addEventListener('click', getidea);


