var weekdaysTable;//creates a table for the weekdays
var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];//array filled the the week day names.
function setWeekDays(){
    var weekdays = weekdaysTable.insertRow(0);
    var blank = weekdays.insertCell(0);
    var Sunday = weekdays.insertCell(1);
    var Monday = weekdays.insertCell(2);
    var Tuesday = weekdays.insertCell(3);
    var Wednesday = weekdays.insertCell(4);
    var Thursday = weekdays.insertCell(5);
    var Friday = weekdays.insertCell(6);
    var Saturday = weekdays.insertCell(7);
    blank.className = 'blank';
    blank.innerHTML = " ";
    Sunday.innerHTML = "Sunday";
    Monday.innerHTML = "Monday";
    Tuesday.innerHTML = "Tuesday";
    Wednesday.innerHTML = "Wednesday";
    Thursday.innerHTML = "Thursday";
    Friday.innerHTML = "Friday";
    Saturday.innerHTML = "Saturday";
	weekdaysTable.className = 'weekdays';
}

//returns array list of objects with the itemId and itemValue
function searchItemsForPID(parentId, callback) {
    'use strict';
	if (localStorage[parentId]) {
		var parentIdsToItemIds = localStorage[parentId].split(',');
		var list = [];

		for (var i in parentIdsToItemIds)
		{
			var itemId = parentIdsToItemIds[i];
			var itemValue = localStorage[itemId];
			list.push({'itemId': itemId, 'itemValue': itemValue});//adds itemId and itemValue to the array list.
		}

		callback(list);
	}
}
function nxtItemID() {//gets the id for where the item is stored
    'use strict';
	localStorage.nextId = localStorage.nextId ? parseInt(localStorage.nextId, 10) + 1 : 0;
	return 'item' + localStorage.nextId;
}
//Stores the items on the dates in local storage
function storeValueForItemId(itemId)
{
	var item = document.getElementById(itemId);
	if(item)
	{
		var parentId = item.parentNode.id;
		localStorage[itemId] = item.value;

		var parentIdsToItemIds = localStorage[parentId] ? localStorage[parentId].split(',') : [];
		var found = false;
		for(var i in parentIdsToItemIds)
		{
			if(parentIdsToItemIds[i] == itemId)
			{
				found = true;
				break;
			}
		}
		if(!found)
		{
			parentIdsToItemIds.push(itemId);
			localStorage[parentId] = parentIdsToItemIds;
		}
	}
}
//This allows the item to be deleted from local storage
function removeItemID(itemId)
{
	delete localStorage[itemId];

	var item = document.getElementById(itemId);
	if(!item) return;
	var parentId = item.parentNode.id;
	if(localStorage[parentId])
	{
		var parentIdsToItemIds = localStorage[parentId].split(',');
		for(var i in parentIdsToItemIds)
		{
			if(parentIdsToItemIds[i] == itemId)
			{
				parentIdsToItemIds = parentIdsToItemIds.slice(0, i).concat(parentIdsToItemIds.slice(i + 1));
				if(parentIdsToItemIds.length) localStorage[parentId] = parentIdsToItemIds;
				else delete localStorage[parentId];
				break;
			}
		}
	}
}

var itemPaddingBottom = (navigator.userAgent.indexOf('Firefox') != -1) ? 2 : 0;
function idForDate(date)
{
	return date.getMonth() + '_' + date.getDate() + '_' + date.getFullYear();
}

function adjustHeight(itemId)
{
	var item = document.getElementById(itemId);
	if(!item) return; 
	item.style.height = '0px';
	item.style.height = item.scrollHeight + itemPaddingBottom + 'px';
}

function keydownHandler()
{
	adjustHeight(this.id);
	if(this.storeTimeout) clearTimeout(this.storeTimeout);
	this.storeTimeout = setTimeout('storeValueForItemId("' + this.id + '")', 100);
}

function checkItem()
{
	if(this.value.length == 0)
	{
		removeItemID(this.id);
		this.parentNode.removeChild(this);
	}
}
//Loads events that are stored in the calendar.
function loadEvent(parentId, itemId)
{
	var item = document.createElement('textarea');
	var parent = document.getElementById(parentId);
	if(!parent) return;
	parent.appendChild(item);
	item.id = itemId;
	item.onkeyup = keydownHandler;
	item.onblur = checkItem;
	item.spellcheck = false;
	return item;
}
/*
When a date is clicked on it allows the user to either input or delete an event.
*/
document.onclick = function(e)
{
	var parentId = e.target.id;
	if(parentId.indexOf('_') == -1) return;

	var item = loadEvent(parentId, nxtItemID());
	adjustHeight(item.id);
	storeValueForItemId(item.id);
	item.focus();
}
var todaysDate;
var firstMonthDay;
var lastMonthDay;
var calendarTable;
var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];//creates array with month names

function generateDay(day, date)
{
	var isShaded = (date.getMonth() % 2);//Every other month will be shaded a different color to help differentiate the months
	var isToday = (date.getDate() == todaysDate.getDate() && date.getMonth() == todaysDate.getMonth() && date.getFullYear() == todaysDate.getFullYear());

	if(isShaded) day.className += ' shaded';
	if(isToday) day.className += ' today';

	day.id = idForDate(date);
	day.innerHTML = '<span>' + date.getDate() + '</span>';

	searchItemsForPID(day.id, function(items)
	{
		for(var i in items)
		{
			var item = loadEvent(day.id, items[i].itemId);
			item.value = items[i].itemValue;
			adjustHeight(item.id);
		}
	});
}
/*
moves the first day of the month to the beginning of the previous week
*/
function firstWeek() {
	var week = calendarTable.insertRow(0);
	var monthName = '';
	do
	{
		firstMonthDay.setDate(firstMonthDay.getDate() - 1);
		if(firstMonthDay.getDate() == 1) monthName = months[firstMonthDay.getMonth()] + '<br />' + firstMonthDay.getFullYear();

		var day = week.insertCell(0);
		generateDay(day, firstMonthDay);
	} while(firstMonthDay.getDay() != 0);

	var month = week.insertCell(0);
	month.className = 'month';
	month.innerHTML = monthName;
}
/*
moves the last day of the month to the end of the next week
*/
function lastWeek() {
	var week = calendarTable.insertRow(-1);
	var monthName = '';
	do
	{
		lastMonthDay.setDate(lastMonthDay.getDate() + 1);
		if(lastMonthDay.getDate() == 1) monthName = months[lastMonthDay.getMonth()] + '<br />' + lastMonthDay.getFullYear();

		var day = week.insertCell(-1);
		generateDay(day, lastMonthDay);
	} while(lastMonthDay.getDay() != 6)

	var month = week.insertCell(0);
	month.className = 'month';
	month.innerHTML = monthName;
}
function scrollPositionForElement(element) {
	var clientHeight = element.clientHeight;
	var y = element.offsetTop;
	while(element.offsetParent && element.offsetParent != document.body)
	{
		element = element.offsetParent;
		y += element.offsetTop;
	}
	return y - (window.innerHeight - clientHeight) / 2;
}

function scrollToToday() {
	window.scrollTo(0, scrollPositionForElement(document.getElementById(idForDate(todaysDate))));
}

var start;
var startY;
var goalY;

function curve(x) {
	return (x < 0.5) ? (4*x*x*x) : (1 - 4*(1-x)*(1-x)*(1-x));
}

function scrollMovement() {
	var percent = (new Date() - start) / 1000;

	if(percent > 1) window.scrollTo(0, goalY);
	else
	{
		window.scrollTo(0, Math.round(startY + (goalY - startY) * curve(percent)));
		setTimeout('scrollMovement()', 10);
	}
}

function documentScrollTop() {
	var scrollTop = document.body.scrollTop;
	if(document.documentElement) scrollTop = Math.max(scrollTop, document.documentElement.scrollTop);
	return scrollTop;
}

function documentScrollHeight() {
	var scrollHeight = document.body.scrollHeight;
	if(document.documentElement) scrollHeight = Math.max(scrollHeight, document.documentElement.scrollHeight);
	return scrollHeight;
}

function scrollToCurrentDate() {
	goalY = scrollPositionForElement(document.getElementById(idForDate(todaysDate)));
	startY = documentScrollTop();
	start = new Date();
	if(goalY != startY) setTimeout('scrollMovement()', 10);
}
//updates todays date 
function poll()
{
	if(documentScrollTop() < 200)
	{
		var oldHeight = documentScrollHeight();
		for(var i = 0; i < 8; i++) firstWeek();
		window.scrollBy(0, documentScrollHeight() - oldHeight);
	}
	else if(documentScrollTop() > documentScrollHeight() - window.innerHeight - 200)
	{
		for(var i = 0; i < 8; i++) lastWeek();
	}
	var newTodayDate = new Date;
	if(newTodayDate.getDate() != todaysDate.getDate() || newTodayDate.getMonth() != todaysDate.getMonth() || newTodayDate.getFullYear() != todaysDate.getFullYear())
	{

		var todayElement = document.getElementById(idForDate(todaysDate));
		if(todayElement) todayElement.className = todayElement.className.replace('today', '');

		todaysDate = newTodayDate;

		todayElement = document.getElementById(idForDate(todaysDate));
		if(todayElement) todayElement.className += ' today';
	}
}
//loads the calendar around todays date
function loadAroundCurrentDate(currentDate)
{
	calendarTable.innerHTML = '';
	firstMonthDay = new Date(currentDate);

	// moves firstMonthDay to the beginning of the week
	while(firstMonthDay.getDay() != 0) firstMonthDay.setDate(firstMonthDay.getDate() - 1);

	// sets lastMonthDay to the day before firstMonthDay
	lastMonthDay = new Date(firstMonthDay);
	lastMonthDay.setDate(firstMonthDay.getDate() - 1);
	lastWeek();//generates the current week
	while(documentScrollHeight() <= window.innerHeight)
	{
		firstWeek();
		lastWeek();
	}

	setTimeout('scrollToToday()', 50);
}
window.onload = function()//when the window opens it immediately loads these functions.
{
    weekdaysTable = document.getElementById('weeks');
    setWeekDays();
	calendarTable = document.getElementById('calendar');
	todaysDate = new Date;
	loadAroundCurrentDate(todaysDate);
	setInterval('poll()', 100);
}
function openHelpMenu() { //open and closes the help menu
    document.getElementById('help').style.display = 'block';
}
function closeHelpMenu() { 
    document.getElementById('help').style.display = 'none';
}
var url = "calendar.html";
var url1 = "CalendarPage.html";
document.write('<div id = "h1">CSULB Student Calendar<div id = "days"><button class="mybutton" onclick="window.location.href = url">logout</button><div id="header"><a class="button" href="javascript:scrollToCurrentDate()">Current Date</a><a class="button" href="javascript:openHelpMenu()">Help</a>&nbsp;</a></div></div></table></div>');
document.write('<table id="weeks"></table>');
document.write('<table id="calendar"></table>');
document.write('<div id="help"><div><ul><li>Click on a date to add an event</li><li>Click on a date to delete an event</li><li>Use the scroll wheel/trackpad to navigate</li></ul><a class="button" href="javascript:closeHelpMenu()">Close</a></div></div>');