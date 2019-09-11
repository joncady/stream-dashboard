var graphql_request_1 = require("graphql-request");

const API_URL = "https://api.smash.gg/gql/alpha";
let instance;

class Client {

    constructor(api = null) {
        if (!api) throw new Error("API Key required to initialize client!");
        const headers = {
            headers: {
                'X-Source': 'smashgg.js',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api
            }
        }
        if (!instance) {
            instance = new graphql_request_1.GraphQLClient(API_URL, headers);
        }
    }

}

Client.prototype.call = async (tournamentSlug) => {
    let query = `
    query StreamQueue($tourneySlug: String!) {
        tournament(slug: $tourneySlug) {
          name
          streamQueue {
            stream {
              streamName
            }
            sets {
              id
              fullRoundText
              slots {
                entrant {
                  participants {
                    player {
                      id
                      twitterHandle
                    }
                    prefix
                    gamerTag
                  }
                  name
                }
              }
            }
          }
        }
      }`;
    let tournament = await instance.request(query, { tourneySlug: tournamentSlug });
    let streamQueue = tournament.tournament.streamQueue;
    if (!streamQueue) throw new Error("Stream queue is empty!");
    return streamQueue;
}

module.exports = Client;
