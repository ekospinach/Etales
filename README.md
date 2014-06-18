# Etales
Business Simulation Game

##Patch List, 2014 JUNE, before testing phase 2

###### Reports
+ New report : additional situation report for two different categories
+ Rural/Urban Profit & Loss Statement,  太宽，通过修改css增加横向滚动条。第一列Fixed不动。

###### Decisions
+ step2，need to change decision regarding advertising…
+ 新建的private label brand 没有parentCompanyID
+ private label discontinue options...
+ negotiation的pop中需要显示当前阶段的BM_listPrice和packformat

###### Overall problems 
+ Facilitator bugs 
+ Initialise/Run seminar without covering existed decision data in the mongo (also in the binary?)
+ Server get down caused by some problems(see screen shots)
+ Need to debug export Alldeal function
+ Exogenous files need to be imported in the right way by period/market/category

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
+ Market report purchase页面，使用editable重做，Total budget必须被随时（点击true或false后）更新。

###### Retailer Decisions 
+ Store management 页面，每次保存决策成功后（品类2，市场2），由于自动刷新了界面，会导致回到不明品类市场的组合下（品类1市场1？）如下状况：
+ Store Management 页面，部分值的IO依然失灵：比如H类市场1中的retailer Pirce，无法存入值
+ 当Seminar.retailer.isDecisioncommitted = true 时，所有页面的决策输入必须被锁定。（做成动态锁定）
+ Market report purchase页面，使用editable重做，Total budget必须被随时更新。
+ Store Management 页面，Add orders功能有问题：从列表上删除的产品没有回到Add列表内，无法再次添加。
+ Store Management 页面，背景色按照2个品类，2个市场的颜色调整.pma

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
+ Key Performance Indicators, 此页中有四行需要popover tips，内容参考pdf。interface效果最好用bootstrap css在每行末尾加一个”i”符号。example : <span class="glyphicon glyphicon-lock"></span>

###### Retailer Confidential reports
+ Consolidated Profit & Loss Statement, 每个”-“和”(1)(2)(3)”之后都有一个空格。目前向后缩进的行其实不需要缩进（参考pdf）。
+ Rural/Urban Profit & Loss Statement, 每个”-“和”(1)(2)(3)”之后都有一个空格。目前向后缩进的行其实不需要缩进（参考pdf）。
+ Rural/Urban Profit & Loss Statement,  弹出单品details的方式需要改善？？？强制增加弹出框中产品列的列宽，使左边的行header和列宽基本平衡。
+ Profitability by Channel, Private Label那列需要正确的merge（参考pdf）
+ Key Performance Indicators, 此页中有3行需要popover tips，内容参考pdf。interface效果最好用bootstrap css在每行末尾加一个”i”符号。example : ```<span class="glyphicon glyphicon-lock"></span>```

###### Market reports
+ Retailer Perception 横纵坐标的label丢失
+ Brand Perception 横纵坐标的label字体过小
+ Supplier/Retailer按照上阶段购买report决策显示当前阶段的报告，1阶段（游戏开始时）时默认显示全部报告。facilitator默认显示全部报告（全根据seminar里的数据来，只是初始化的时候我们默认把0阶段的report购买数据全设定成true）。
+ Retailer/Brand Perception 横纵坐标的label字体过小，再放大2号
+ Market Shares by Consumer Segment- Elecssories - Rural 菜单label和显示内容不符
+ Market Shares by Consumer Segment- HealthBeauties - Urban 菜单label和显示内容不符
+ Market Shares by Shopper Segment- Elecssories - Rural 菜单label和显示内容不符
+ Market Shares by Shopper Segment- HealthBeauties - Urban 菜单label和显示内容不符
+ Sales by Consumer Segment/Shopper Segment，有可能有上述相同问题，需要double-check code


###### System Overrall 
+ 部署服务器时SocketIO不工作
+ bug in the negotiation module, cannot generate contract details automatically
+ SeminarInfo 中producer/Retailer数组PeriodInfo数量不足
+ Admin page, New seminar is not working 
+ Negotiation :  If they cannot reach any agreement, need to copy agreement last period automatically.
+ Service PeriodInfo 有问题 : 静态 无法主动更新

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
