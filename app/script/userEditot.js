
'use strict'
 
const ipc = require('electron').ipcRenderer;
const url = require('url');
const path = require('path');
const fs = require("fs");
 
//获取本地json文件文件的路径
const newFile_path = path.join(__dirname, 'data/user.json').replace(/\\/g, "\/");
 
//点击最小化按钮
$(".sys-control-box .sys-btn-minis").click(function () {
    ipc.send('mini-user-editor-window');
});
 
//默认显示最大窗口
var isBig = false;
//点击最大化窗口按钮
$(".sys-control-box .sys-btn-big").click(function () {
    if (isBig) {
        //修改背景图标，并向主进通信，发送通知
        $(this).css('background', 'url(' + getSmallUrl() + ')');
        ipc.send('turn-small-user-editor');
    } else {
        $(this).css('background', 'url(' + getBigUrl() + ')');
        ipc.send('turn-big-user-editor');
    }
    isBig = !isBig;
});
 
//点击关闭按钮
$(".sys-control-box .sys-btn-closed").click(function () {
    ipc.send('close-user-editor-window');
});
 
//接受主进程发送过来的登录成功后的用户信息，并在用户编辑窗口回显
ipc.on('loginUserData', function (event, message) {
    let user = JSON.parse(message);
    console.log(user);
    $("#userid input").val(user.id);
    $("#userlid input").val(user.lid);
    $(".username input").val(user.name);
    $(".department input").val(user.department);
    $(".project input").val(user.project);
    $(".telephone input").val(user.telephone);
    $(".email input").val(user.email);
});
 
//点击保存按钮，获取输入框内容，并提交
$(".saveForm .saveButton").click(function () {
    $(".errorInformation").hide();
    var newPassword = $(".newPassword input").val();
    var isPassword = $(".isPassword input").val();
    if (newPassword == isPassword) {
        var userId = $("#userid input").val();
        var userlId = $("#userlid input").val();
        var username = $(".username input").val();
        var department = $(".department input").val();
        var project = $(".project input").val();
        var telephone = $(".telephone input").val();
        var email = $(".email input").val();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://localhost:8080/DemoWeb/user/update.do",
            data: { userId: userId, username: username, department: department, project: project, telephone: telephone, email: email, password: newPassword, lid: userlId },
            error: function () {
                updateUserMessage(userlId, username, department, project, telephone, email, newPassword);
            },
            success: function (forward) {
                if (forward.success) {
                    console.info(forward.data);
                    alert("修改成功");
                }
                else {
                    alert(forward.data);
                }
            }
        });
 
    } else {
        $(".errorInformation").show();
        $(".errorInformation").text("密码不一致，无法提交！");
    }
});
 
//获取显示最大化窗口后需要显示的图标的路径
function getBigUrl() {
 
    const img_small = url.format({
        pathname: path.join(__dirname, 'imgs/turnsmall.png'),
        protocol: 'file',
        slashes: true
    });
    var newUrl = img_small.replace(/\\/g, "\/");
 
    return newUrl;
}
 
//获取显示最大化窗口之前需要显示的图标的路径
function getSmallUrl() {
    const img_big = url.format({
        pathname: path.join(__dirname, 'imgs/turnbig.png'),
        protocol: 'file',
        slashes: true
    });
    var newUrl = img_big.replace(/\\/g, "\/");
    return newUrl;
}
 
//保存用户信息，修改本地json文件的内容
function updateUserMessage(userlId, username, department, project, telephone, email, newPassword) {
    if (newPassword == "") {
        var params = {
            "name": username,
            "department": department,
            "project": project,
            "telephone": telephone,
            "email": email,
        }
    } else {
        var params = {
            "name": username,
            "department": department,
            "project": project,
            "telephone": telephone,
            "email": email,
            "password": newPassword
        }
    }
    //读取本地json文件
    let result = JSON.parse(fs.readFileSync(newFile_path));
    //修改本地json文件的内容
    for (var i in result) {
        if (userlId == result[i].lid) {
            for (var key in params) {
                if (result[i][key]) {
                    result[i][key] = params[key];
                }
            }
        }
    }
    //格式化输出json文件
    let newData = JSON.stringify(result,null,4);
    fs.writeFile(newFile_path, newData, (error) => {
        if (error) {
            console.error(error);
        }
        alert("保存成功");
    });
}