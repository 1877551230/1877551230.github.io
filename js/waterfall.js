/* jshint asi:true */
//先等图片都加载完成
//再执行布局函数

/**
 * 执行主函数
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
(function() {

  /**
     * 内容JSON
     */
  var demoContent = [
    {
      demo_link: 'https://1877551230.github.io/css_Demo/',
      img_link: 'https://github.com/1877551230/1877551230.github.io/blob/master/img/secret.png?raw=true',
      code_link: 'https://github.com/1877551230/css_Demo',
      title: 'css的基础用法',
      core_tech: 'css',
      description: '一些最基础的css用法'
    }, {
      demo_link: 'http://1877551230.github.io/event_Demo/',
      img_link: 'https://github.com/1877551230/1877551230.github.io/blob/master/img/secret.png?raw=true',
      code_link: 'https://github.com/1877551230/event_Demo',
      title: 'js中event的基本用法',
      core_tech: 'JavaScript',
      description: ''
    }, {
      demo_link: 'http://1877551230.github.io/JavaScript_Demo/',
      img_link: 'https://github.com/1877551230/1877551230.github.io/blob/master/img/secret.png?raw=true',
      code_link: 'https://github.com/1877551230/JavaScript_Demo',
      title: 'JavaScript基础用法',
      core_tech: 'JavaScript',
      description: '最基础的JavaScript的使用方法'
    }, {
      demo_link: 'http://1877551230.github.io/htmlLayout-_Demo/',
      img_link: 'https://github.com/1877551230/1877551230.github.io/blob/master/img/secret.png?raw=true',
      code_link: 'https://github.com/1877551230/htmlLayout-_Demo',
      title: 'html层居中的基础案例',
      core_tech: 'html',
      description: 'html层居中的基础用法'
    }, {
      demo_link: 'http://1877551230.github.io/json_Demo/',
      img_link: 'https://github.com/1877551230/1877551230.github.io/blob/master/img/secret.png?raw=true',
      code_link: 'https://github.com/1877551230/json_Demo',
      title: 'JavaScript中json的基础用法',
      core_tech: 'JavaScript',
      description: 'json的基础使用方法'
    }, {
      demo_link: 'http://1877551230.github.io/html_Demo2',
      img_link: 'https://github.com/1877551230/1877551230.github.io/blob/master/img/secret.png?raw=true',
      code_link: 'https://github.com/1877551230/html_Demo2',
      title: '不同窗口大小换背景',
      core_tech: 'JavaScript',
      description: '根据窗口大小的不同,自动换背景图片'
    }, {
      demo_link: 'http://1877551230.github.io/html_Demo',
      img_link: 'https://github.com/1877551230/1877551230.github.io/blob/master/img/secret.png?raw=true',
      code_link: 'https://github.com/1877551230/html_Demo2',
      title: 'html标签的基本用法',
      core_tech: 'html',
      description: 'html标签最基础的用法'
    }
  ];

  contentInit(demoContent) //内容初始化
  waitImgsLoad() //等待图片加载，并执行布局初始化
}());

/**
 * 内容初始化
 * @return {[type]} [description]
 */
function contentInit(content) {
  // var htmlArr = [];
  // for (var i = 0; i < content.length; i++) {
  //     htmlArr.push('<div class="grid-item">')
  //     htmlArr.push('<a class="a-img" href="'+content[i].demo_link+'">')
  //     htmlArr.push('<img src="'+content[i].img_link+'">')
  //     htmlArr.push('</a>')
  //     htmlArr.push('<h3 class="demo-title">')
  //     htmlArr.push('<a href="'+content[i].demo_link+'">'+content[i].title+'</a>')
  //     htmlArr.push('</h3>')
  //     htmlArr.push('<p>主要技术：'+content[i].core_tech+'</p>')
  //     htmlArr.push('<p>'+content[i].description)
  //     htmlArr.push('<a href="'+content[i].code_link+'">源代码 <i class="fa fa-code" aria-hidden="true"></i></a>')
  //     htmlArr.push('</p>')
  //     htmlArr.push('</div>')
  // }
  // var htmlStr = htmlArr.join('')
  var htmlStr = ''
  for (var i = 0; i < content.length; i++) {
    htmlStr += '<div class="grid-item">' + '   <a class="a-img" href="' + content[i].demo_link + '">' + '       <img src="' + content[i].img_link + '">' + '   </a>' + '   <h3 class="demo-title">' + '       <a href="' + content[i].demo_link + '">' + content[i].title + '</a>' + '   </h3>' + '   <p>主要技术：' + content[i].core_tech + '</p>' + '   <p>' + content[i].description + '       <a href="' + content[i].code_link + '">源代码 <i class="fa fa-code" aria-hidden="true"></i></a>' + '   </p>' + '</div>'
  }
  var grid = document.querySelector('.grid')
  grid.insertAdjacentHTML('afterbegin', htmlStr)
}

/**
 * 等待图片加载
 * @return {[type]} [description]
 */
function waitImgsLoad() {
  var imgs = document.querySelectorAll('.grid img')
  var totalImgs = imgs.length
  var count = 0
  //console.log(imgs)
  for (var i = 0; i < totalImgs; i++) {
    if (imgs[i].complete) {
      //console.log('complete');
      count++
    } else {
      imgs[i].onload = function() {
        // alert('onload')
        count++
        //console.log('onload' + count)
        if (count == totalImgs) {
          //console.log('onload---bbbbbbbb')
          initGrid()
        }
      }
    }
  }
  if (count == totalImgs) {
    //console.log('---bbbbbbbb')
    initGrid()
  }
}

/**
 * 初始化栅格布局
 * @return {[type]} [description]
 */
function initGrid() {
  var msnry = new Masonry('.grid', {
    // options
    itemSelector: '.grid-item',
    columnWidth: 250,
    isFitWidth: true,
    gutter: 20
  })
}
