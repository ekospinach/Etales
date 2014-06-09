# Etales
Business Simulation Game

##Patch List, 2014 JUNE

###### Supplier Decisions 
+ push notification bugs fix
+ Product Portfolio management页面,  New Product功能完全失灵
+ Product Portfolio management页面,增加即时变化的unitCost列
+ Product Portfolio management页面,漏掉了discontinue选项
+ Product Portfolio management页面,第一列宽度需要加宽，当按钮出现时，layout被破坏。
+ Product Portfolio management页面,可添加完全同名的单品。当删除同名单品时，新旧单品将被一起删除。
+ Online Store Management页面，Frequency取值范围应该为0~26weeks
+ Asset Investment页面，Capacity 输入范围错误
+ Online Store Management页面，order volumes字样改为Online planned volume, 输入范围为，0 ~ 当前单品的本阶段产量 + 上阶段online库存。本阶段产量即为当前阶段此单品在Step4中的的决策，上阶段的online库存去```scrviv_Closing[INTERNET]```中取。(注意参数为INTERNET)
+ 当Seminar.producer.isDecisioncommitted = true 时，所有页面的决策输入必须被锁定。（做成动态锁定）

###### Retailer Decisions 
+ Store management 页面，每次保存决策成功后（品类2，市场2），由于自动刷新了界面，会导致回到不明品类市场的组合下（品类1市场1？）如下状况：
+ Store Management 页面，部分值的IO依然失灵：比如H类市场1中的retailer Pirce，无法存入值
+ 当Seminar.retailer.isDecisioncommitted = true 时，所有页面的决策输入必须被锁定。（做成动态锁定）

###### Reports Overall
+ 所有带括号的内容前后必须有一个空格。example: Financial Results-B&M Business Profit & Loss Statement(Elecssories). 应为：     Financial Results - B&M Business Profit & Loss Statement (Elecssories)

###### General reports
+ Market shares report 图表内缺少labels : Total/by Market/by Consumer Segment/by Shopper segment (参考pdf)
+ Sales report 图表内缺少labels : Total/by Market/by Consumer Segment/by Shopper segment (参考pdf)
+ Cross-Segment report 图表内缺少labels: Shopper Segments/Consumer Segment (参考pdf)

###### Supplier Confidential reports
+ Consolidated Profit & Loss Statement, 每个”-“和”(1)(2)(3)”之后都有一个空格。
+ BM Business Profit & Loss Statement, 每个”-“和”(1)(2)(3)”之后都有一个空格。
+ BM Business Profit & Loss Statement,  弹出单品details的方式需要改善？？？强制增加弹出框中产品列的列宽，使左边的行header和列宽基本平衡。
+ Online Profit & Loss Statement, 每个”-“和”(1)(2)(3)”之后都有一个空格。’
+ Online Profit & Loss Statement, 太宽，通过修改css增加横向滚动条
+ Situation Report - Volume, 有两列需要merge（参考pdf）

###### Retailer Confidential reports
+ Consolidated Profit & Loss Statement, 每个”-“和”(1)(2)(3)”之后都有一个空格。目前向后缩进的行其实不需要缩进（参考pdf）。
+ Rural/Urban Profit & Loss Statement, 每个”-“和”(1)(2)(3)”之后都有一个空格。目前向后缩进的行其实不需要缩进（参考pdf）。
+ Rural/Urban Profit & Loss Statement,  弹出单品details的方式需要改善？？？强制增加弹出框中产品列的列宽，使左边的行header和列宽基本平衡。
+ Profitability by Channel, Private Label那列需要正确的merge（参考pdf）
+ Key Performance Indicators, 此页中有3行需要popover tips，内容参考pdf。interface效果最好用bootstrap css在每行末尾加一个”i”符号。example : ```<span class="glyphicon glyphicon-lock"></span>```

###### Market reports
+ Retailer Perception 横纵坐标的label丢失
+ Brand Perception 横纵坐标的label字体过小


## Directory Layout

    app/                --> all of the files to be used in production
      css/              --> css files
        app.css         --> default stylesheet
      img/              --> image files
      index.html        --> app layout file (the main html template file of the app)
      index-async.html  --> just like index.html, but loads js files asynchronously
      js/               --> javascript files
        app.js          --> application
        controllers.js  --> application controllers
        directives.js   --> application directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
      lib/              --> angular and 3rd party javascript libraries
        angular/
          angular.js        --> the latest angular js
          angular.min.js    --> the latest minified angular js
          angular-*.js      --> angular add-on modules
          version.txt       --> version number
      partials/             --> angular view partials (partial html templates)
        partial1.html
        partial2.html

    config/testacular.conf.js        --> config file for running unit tests with Testacular
    config/testacular-e2e.conf.js    --> config file for running e2e tests with Testacular

    scripts/            --> handy shell/js/ruby scripts
      e2e-test.sh       --> runs end-to-end tests with Testacular (*nix)
      e2e-test.bat      --> runs end-to-end tests with Testacular (windows)
      test.bat          --> autotests unit tests with Testacular (windows)
      test.sh           --> autotests unit tests with Testacular (*nix)
      web-server.js     --> simple development webserver based on node.js

    test/               --> test source files and libraries
      e2e/              -->
        runner.html     --> end-to-end test runner (open in your browser to run)
        scenarios.js    --> end-to-end specs
      lib/
        angular/                --> angular testing libraries
          angular-mocks.js      --> mocks that replace certain angular services in tests
          angular-scenario.js   --> angular's scenario (end-to-end) test runner library
          version.txt           --> version file
      unit/                     --> unit level specs/tests
        controllersSpec.js      --> specs for controllers
        directivessSpec.js      --> specs for directives
        filtersSpec.js          --> specs for filters
        servicesSpec.js         --> specs for services

## Contact

For more information on AngularJS please check out http://angularjs.org/
