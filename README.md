# Downloaders-Analysis

Subjects of analysis:
CURL (https://github.com/curl/curl)
Description: A command line tool and library for transferring data with URL syntax.
WGET (https://github.com/mirror/wget)
Description: GNU project utility for retrieving files using HTTP, HTTPS, FTP and FTPS protocols.
ARIA 2 (https://github.com/aria2/aria2)
Description: aria2 is a lightweight multi-protocol & multi-source, cross platform download utility operated in command-line.

Purpose: Curl, wget and aria2 are tools to download files and exchange data from/to a server. These tools support command line operations with various options (eg recursive download). They each support multiple platforms like Linux, Windows, macOS etc., and protocols like FTP, HTTP, HTTPS.

Folder organization: Top level folders are as per the high-level metrics. Source codes are in respective folders with their results.

Performance:
To verify the performance results, run bitrate module using Node to get the bitrate. Run bash script in "average-response time" to get the average time. The results are in "performance -> results" for cross checking.

Feature Set
https://docs.google.com/spreadsheets/d/14_lLdGgBfABBysV3Jd2joTX_IT4s9J_sZADhYZml2UE/edit#gid=0

Static analysis:
For static analysis software tools like coverity and sonarQube used and results have been uploaded.
To verify our gitrob results follow documentation here: 
https://github.com/michenriksen/gitrob

Community health:
To verify pr-and-issue-turnaround scripts, use Node to run retrieval scripts, and then use http-server NPM module to generate charts using D3.js. The results are in "pr-and-issue-turn-around -> results" folder for cross-checking.
To verify our StackExchange result go here: https://data.stackexchange.com/stackoverflow/query/908506
To verify git-of-theseus analysis follow documentation here: https://github.com/erikbern/git-of-theseus

