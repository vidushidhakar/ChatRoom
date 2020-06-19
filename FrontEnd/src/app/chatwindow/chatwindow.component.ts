import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.css']
})
export class ChatwindowComponent implements OnInit {

  loggedInUserName;
  loggedInUserEmail;
  constructor() { }

  ngOnInit(): void {
    this.loggedInUserEmail= localStorage.getItem('email')
    this.loggedInUserName= localStorage.getItem('name')
    console.log(this.loggedInUserName);
  

    $(".menu a i").on("click",function(){$(".menu a i").removeClass("active"),$(this).addClass("active")})
    ,$("#contact, #recipient").click(function(){$(this).remove()})
    // ,$(function(){$('[data-toggle="tooltip"]').tooltip()})
    ,$(document).ready(function(){$(".filterMembers").not(".all").hide(3000)
    ,$(".filterMembers").not(".all").hide(3000)
    ,$(".filterMembersBtn").click(function(){var t=$(this).attr("data-filter");
    $(".filterMembers").not("."+t).hide(3000),$(".filterMembers").filter("."+t).show(3000)})})
    ,$(document).ready(function(){$(".filterDiscussions").not(".all").hide(3000)
    ,$(".filterDiscussions").not(".all").hide(3000)
    ,$(".filterDiscussionsBtn").click(function(){var t=$(this).attr("data-filter");$(".filterDiscussions").not("."+t).hide(3000)
    ,$(".filterDiscussions").filter("."+t).show(3000)})})
    ,$(document).ready(function(){$(".filterNotifications").not(".all").hide(3000)
    ,$(".filterNotifications").not(".all").hide(3000)
    ,$(".filterNotificationsBtn").click(function(){var t=$(this).attr("data-filter");
    $(".filterNotifications").not("."+t).hide(3000),$(".filterNotifications").filter("."+t).show(3000)})})
    // ,$(document).ready(function(){$("#people").on("keyup",function(){var t=$(this).val().toString().toLowerCase();
  //   $("#contacts a").filter(function(){$(this).toggle($(this).text().toString().toLowerCase().indexOf(t)>-1)})})})
  //   ,$(document).ready(function(){$("#conversations").on("keyup",function(){var t=$(this).val().toString().toLowerCase();
  //   $("#chats a").filter(function(){$(this).toggle($(this).text().toString().toLowerCase().indexOf(t)>-1)})})})
  //   ,$(document).ready(function(){$("#notice").on("keyup",function(){var t=$(this).val().toString().toLowerCase();$("#alerts a").filter(function(){$(this).toggle($(this).text().toString().toLowerCase().indexOf(t)>-1)})})})
  //   ,$(document).ready(function(){clicked=!0,$(".mode").click(function(){clicked?($("head").append('<link href="assets/dist/css/dark.min.css" id="dark" type="text/css" rel="stylesheet">'),clicked=!1):($("#dark").remove(),clicked=!0)})}),$(".back").click(function(){$("#call"+$(this).attr("name")).hide(),$("#chat"+$(this).attr("name")).removeAttr("style")})
  //   ,$(".connect").click(function(){$("#chat"+$(this).attr("name")).hide()
  //   ,$("#call"+$(this).attr("name")).show()});
  }

  
 }
 
