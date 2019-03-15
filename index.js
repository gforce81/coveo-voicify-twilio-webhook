// Dependencies
const bodyParser = require('body-parser');
const http = require('https');
const twilioAccountSid = 'YOUR_TWILIO_ACCOUNT_ID';
const twilioAuthToken = 'YOUR_TWILIO_TOKEN';
const twilioFromNumber = 'YOUR_TWILIO_SMS_ENABLED_NUMBER';
const twilioToNumber = 'NUMBER_TO_SEND_MESSAGE_TO';
const client = require('twilio')(twilioAccountSid, twilioAuthToken);

exports.webhook = (req, res) => {
    const voicifyId = req.body.id;
    const voicifyContent = req.body.content;

    //removes the NLP to keep only the search terms
    const voicifyTerms = voicifyContent.split("for ");
    const voicifySearchTerms = voicifyTerms[1];
    console.log("VOICIFY QUERY: " + voicifyContent);
    console.log("VOICIFY SEARCH TERMS: " + voicifySearchTerms);

    // Coveo constants for Demo
    const coveoToOrg = "YOUR_COVEO_ORG_ID";
    const coveoToApiKey = "YOUR_COVEO_API_KEY_WITH_SEARCH_PRIVILEGE";
    const coveoToPipeline = "YOUR_COVEO_QUERY_PIPELINE_NAME";
    
    const reqUrl = encodeURI(`https://platform.cloud.coveo.com/rest/search/v2?q=${voicifySearchTerms}&organizationId=${coveoToOrg}&access_token=${coveoToApiKey}&pipeline=${coveoToPipeline}`);
    console.log("QUERY SENT: " + reqUrl);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const search = JSON.parse(completeResponse);
            let numberOfResults = search.totalCount;
            
            //Fields
            let resultTitle = search.results[0].title;
            let resultDescription = search.results[0].raw.description;
            let resultURI = search.results[0].ClickUri;
            //static image with Isango Logo. Could be dynamic
            let imageToSend = "https://www.isango.com/phoenix/images/ourbrands/isango.png"
            
            
            //Voicify specific fields    
            let dataToSend = `I found ${numberOfResults} results. \n\n The most relevant result is ${resultTitle}. \n\n Description: \n ${resultDescription} \n\n I am sending you a text message with all the details.`;

            client.messages
                .create({
                    body: `${resultTitle} \n\n Link: ${resultURI} \n\n ${resultDescription}`,
                    from: twilioFromNumber,
                    mediaUrl: imageToSend,
                    to: twilioToNumber
                })
                .then(message => console.log(message.sid));
            console.log("SMS SENT");

            setTimeout(function() {
                return res.json({
                    "data": {
                        "id": "anID",
                        "content": dataToSend,
                        },
                        "backgroundImage": {
                            "id": "anID",
                            "name": "file_name.png",
                            "url": imageToSend,
                            "fileExtension": "png",
                            "mediaType": "ImageFile",
                            "applicationId": "an id"
                        },
                        "foregroundImage": {
                            "id": "anID",
                            "name": "file_name.png",
                            "url": imageToSend,
                            "fileExtension": "png",
                            "mediaType": "ImageFile",
                            "applicationId": "an id"
                        }
                })
            }, 2000);
        });
    }, (error) => {
        return res.json({
            "data": {
                "id": "anID",
                "content": "Something went wrong",
                }
        })
    });
}
