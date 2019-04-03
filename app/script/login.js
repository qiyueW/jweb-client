//启用严格模式
'use strict'
 
const ipc = require('electron').ipcRenderer;
const url = require('url');
const path = require('path');
const fs = require("fs");
 
//点击登录按钮时，获取输入框内容并提交
$(".loginForm .loginButton").click(function () {
    $(".errorInformation").hide();
    var username = $.trim($(".username .textInput").val());
    var password = $.trim($(".password .textInput").val());
 
    if (username == "") {
        $(".errorInformation").show();
        $(".errorInformation").text("请输入账号");
        $(".username .textInput").focus();
        return false;
    }
 
    if (password == "") {
        $(".errorInformation").show();
        $(".errorInformation").text("请输入密码");
        $(".password .textInput").focus();
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://localhost:8080/DemoWeb/user/loginss.do",
        data: { username: username, password: password },
        error: function () {
            console.info("当前访问的是本地文件登录");
            readFilePath(username, password);
        },
        success: function (forward) {
            console.info("当前访问的是服务器登录");
            if (forward.success) {
                //向主进程通信，发送打开编辑用户窗口的通知
                let userData = JSON.stringify(forward.data);
                ipc.send('open-user-editor', userData);
            }
            else {
                $(".errorInformation").show();
                $(".errorInformation").text("用户名或密码错误!");
            }
        }
    });
});
 
function readFilePath(username, password) {
 
    var loginFlag = false;
    //获取本地json文件的路径
    const newFile_path = path.join(__dirname, 'data/user.json').replace(/\\/g, "\/");
 
    fs.exists(newFile_path, function (exists) {
        console.log(exists ? "文件存在" : "文件不存在");
        if (!exists) {
            $(".errorInformation").show();
            $(".errorInformation").text("查找失败，本地文件不存在!");
            return;
        } else {
            //读取本地的json文件
            let result = JSON.parse(fs.readFileSync(newFile_path));
            //遍历读取到的用户对象，进行登录验证
            for (var i in result) {
                if ((result[i].lid == username) && (result[i].password == password)) {
                    //验证成功，向主进程通信，发送打开编辑用户窗口的通知
                    let data = JSON.stringify(result[i]);
                    ipc.send('open-user-editor', data);
                    loginFlag = true;
                    break;
                }
            }
            if (!loginFlag) {
                $(".errorInformation").show();
                $(".errorInformation").text("用户名或密码错误!");
            }
        }
    });
}