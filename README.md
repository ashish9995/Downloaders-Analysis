# Downloaders-Analysis
Analysis of downloading tools which includes curl, wget and aria2 based upon the speed at which the tools download from a common site.
Folder organization: Top level folders are as per the high-level metrics. Source codes are in respective folders with their results.

Performance:
To verify our performance results, run bitrate module using Node to get the bitrate. Run bash script in "average-response time" to get the average time. The results are in "performance -> results" for cross checking.

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

