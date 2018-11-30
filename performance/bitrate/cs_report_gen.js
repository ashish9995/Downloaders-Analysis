var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var json2csv = require('json2csv');

var DOWNLOAD_FILE = "https://www.google.com";

var download_file_wget = function(file_url) {
    var file_name = url.parse(file_url).pathname.split('/').pop();
    var report_file_name = 'wget_report.csv';

    var wget = 'wget -P dev/null ' + file_url;

    child = exec(wget, function (error, stdout, stderr) {
             console.log('stderr: ' + stderr);
            var regex = /\((.*?)\/s\)/g;
            var found = stderr.match(regex);
            write_to_csv(found[0], report_file_name);
        });
};

var download_file_aria2 = function(file_url) {
    var file_name = url.parse(file_url).pathname.split('/').pop();
    var op_file_name = "aria2_log.csv";
    var report_file_name = 'aria2_report.csv';

    var aria2 = 'aria2c -o /dev/null ' + file_url + ' --server-stat-of=' + op_file_name;

    child = exec(aria2, function (error, stdout, stderr) {
            // console.log('stdout: ' + stdout);
            transfer_to_report(op_file_name, report_file_name);
        });
};

var download_file_curl = function(file_url) {
    var file_name = url.parse(file_url).pathname.split('/').pop();
    var report_file_name = 'curl_report.csv';

    var curl = '/usr/bin/curl -m 60 -w "%{speed_download}" -o /dev/null -s ' + file_url;

    child = exec(curl, function (error, stdout, stderr) {
            // console.log('stdout: ' + stdout);
            write_to_csv(stdout, report_file_name);
        });
};

var write_to_csv = function(content, report_file_name) {
    var newLine= "\r\n";
    var fields = ['Speed'];
    var appendThis = [
        {
            'Speed': content
        }
    ];
    var toCsv = {
        data: appendThis,
        fields: fields,
        hasCSVColumnTitle: false
    };
    fs.stat(report_file_name, function (err, stat) {
        if (err == null) {
            //write the actual data and end with newline
            // var csv = json2csv(toCsv) + newLine;
            var csv = content + newLine;
            fs.appendFile(report_file_name, csv, function (err) {
                if (err) throw err;
                console.log(getDateTime() + 'The "data to append" was appended to file ' + report_file_name);
            });
        }
        else {
            fields= (fields + newLine);
            fs.writeFile(report_file_name, fields, function (err, stat) {
                if (err) throw err;
                console.log(getDateTime() + report_file_name + 'file saved');
            });
        }
    });
};

var transfer_to_report = function(file_name, report_file_name) {
    var csv = require("fast-csv");
    var data = '';
    csv.fromPath(file_name).on("data", function(chunk){
        data += chunk;
    }).on("end", function(){
        var regex = /sc_avg_speed=(.*?),/g;
        var all = data.match(regex);
        var content = all[0].split("=")[1].split(",")[0].trim();
        write_to_csv(content, report_file_name)
    });
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

var main = function() {
    setTimeout(() => {
        download_file_wget(DOWNLOAD_FILE);
    }, 1000*1); 
    setTimeout(() => {
        download_file_aria2(DOWNLOAD_FILE);
    }, 1000*2);
    setTimeout(() => {
        download_file_curl(DOWNLOAD_FILE);
    }, 1000*3);
    setTimeout(() => {
        main();
    }, 1000*5); 
}
main();
