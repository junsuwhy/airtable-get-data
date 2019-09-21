docker run --rm -it --name=airtable-get-data -v $(pwd)/server.js:/usr/src/app/server.js -v $(pwd)/apikey.js:/usr/src/app/apikey.js -p 22344:8080 junsuwhy/airtable-get-data:latest
