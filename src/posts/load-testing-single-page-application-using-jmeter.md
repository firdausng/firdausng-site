---
title: 'Load testing single page application using jmeter is not straightforward'
date: "2018-05-31"
categories:
  - Performance Test
  - jmeter
published: true
author: Me
image: /images/load-testing-single-page-application-using-jmeter.webp
description: Load testing SPAs with JMeter can be challenging due to their asynchronous nature. SPAs use JavaScript to render HTML pages and send requests via the XMLHttpRequest object1. However, JMeter sends HTTP requests sequentially, affecting response times. For example, if a SPA button triggers three concurrent XMLHttpRequests, JMeter processes them sequentially, leading to inaccurate response times. Solutions include custom JSR223 Sampler, Custom AJAX Request Sampler, and WebDriver Sampler, but each has limitations. Performance test engineers must understand the application’s architecture for realistic load testing in JMeter
---

It is always tricky whenever i need to perform load testing a [single page application site (SPA)](https://en.wikipedia.org/wiki/Single-page_application) using jmeter. SPA is built using JavaScript to render the html page and used **XMLHttpRequest** object to send request to server. XMLHttpRequest is executed by javascript and can be sent as **asynchronous** request which mean that multiple XMLHttpRequest objects can be executed at the same time.

This presented a technical challenge for jmeter because jmeter is sending http request sequentially which make the response time for a single transition controller that contains multiple XMLHttpRequest request is much higher that it actually is.

Imagine that your SPA have a button that is when clicked is sending 3 XMLHttpRequest to the server concurrently. All these 3 requests is not waiting for each other to complete to render the page since all 3 of them is rendering different part of the page.

Now if we are to use jmeter to perform the same click the button action, jmeter instead will sent these 3 request sequentially. your response time will be the result of addition of these 3 request instead of looking at the longest response time between these 3 request.

if we looking at this [article by Blazemeter](https://www.blazemeter.com/blog/how-load-test-ajaxxhr-enabled-sites-jmeter), they proposed these solutions

- custom JSR223 Sampler
- Write a Custom AJAX Request Sampler
- WebDriver Sampler
  These are good solution but as mentions in the blazemeter, there are few thing that you need to considered when using these solution such as

webdriver consume a lot of resources, which make it less ideal if u have limitation of load generator
custom sampler and custom JSR223 Sampler requires Java development knowledge
Apart from above considerations, there are these issues,

There are XMLHttpRequests response that contain a dynamic resources path that need to be fetch.
SPA used a lot of JavaScript, sometimes even with all the XMLHttpRequests are finished fetched from server, the JavaScript engine in the browser take sometime to render the page
This means that Performance test engineer need to have a very good understanding of the application's architecture to execute the load test in SPA application. That is the only way to have a realistic load test primarily in Jmeter.