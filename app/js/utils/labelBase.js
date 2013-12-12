var getLabelBase = function(){
	return [
		/*map*/
		{id:'Ease of Use perception',  ENG:'Ease of Use perception',  CHN:'易用度感知',  RUS:''},
		{id:'Quality perception',  ENG:'Quality perception',  CHN:'品质感知',  RUS:''},
		{id:'Performance perception',  ENG:'Performance perception',  CHN:'使用效果感知',  RUS:''},
		{id:'Gentleness perception',  ENG:'Gentleness perception',  CHN:'润滑度感知',  RUS:''},
		{id:'PricePerception',  ENG:'PricePerception',  CHN:'价格感知',  RUS:''},
		{id:'Producer',  ENG:'Producer ',  CHN:'生产商 ',  RUS:''},
		{id:'Retailer',  ENG:'Retailer ',  CHN:'零售商 ',  RUS:''},
		{id:'switchLanguage',  ENG:'Switch Language',  CHN:'切换界语言',  RUS:''},
		/*producerstep1*/
		{id:'Products portfolio',  ENG:'Products portfolio',  CHN:'',  RUS:''},
		{id:'Products portfolio Info',  ENG:'Step 1 of 4, determine your products portfolio, i.e. brand names, variant(s) of each brand with their respective name(s) and product composition or product specification, including packaging format.',  CHN:'',  RUS:''},
		{id:'Step 1 of 4',  ENG:'Step 1 of 4',  CHN:'第一步',  RUS:''},
		{id:'Producer Step 1 of 4 Info',  ENG:'Products Portfolio Management',  CHN:'',  RUS:''},
		{id:'Category',  ENG:'Category',  CHN:'品类',  RUS:''},
		{id:'Elecssories',  ENG:'Elecssories',  CHN:'消耗品',  RUS:''},
		{id:'HealthBeauty',  ENG:'HealthBeauty',  CHN:'护肤品',  RUS:''},
		{id:'Avaliable Budget',  ENG:'Total Avaliable Budget for Remaing Period',  CHN:'',  RUS:''},
		{id:'Producer Available Capacity',  ENG:'Available Capacity',  CHN:'',  RUS:''},
		{id:'Brand',  ENG:'Brand',  CHN:'品牌',  RUS:''},
		{id:'Variant',  ENG:'Variant',  CHN:'单品',  RUS:''},
		{id:'More',  ENG:'More',  CHN:'更多',  RUS:''},
		{id:'Delete',  ENG:'Delete',  CHN:'删除',  RUS:''},	
		{id:'Pack Format',  ENG:'Pack Format',  CHN:'包',  RUS:''},
		{id:'Pack Format Info',  ENG:'is one value from the list ECONOMY, STANDARD, PREMIUM. Influences price and quality perceptions of a brand. Affects production cost. ',  CHN:'',  RUS:''},
		{id:'Technology Level',  ENG:'Technology Level',  CHN:'技术水平',  RUS:''},
		{id:'Technology Level Info',  ENG:'an Elecsorries and Health/Beauty product attribute; an index from 1 to 20 defining quality level of a product; in Elecsorries influences quality and ease of use perceptions; in Health/Beauty allows successful merging of active agent with smoothener; affects production cost. ',  CHN:'',  RUS:''},
		{id:'Design Level',  ENG:'Design Level',  CHN:'设计指数',  RUS:''},
		{id:'Design Level Info',  ENG:'an Elecsorries product attribute; an index from 1 to 20 defining design of a product; influences ease of use and quality perceptions; affects product cost. ',  CHN:'',  RUS:''},
		{id:'Quality-of-Raw-Materials',  ENG:'Quality-of-Raw-Materials',  CHN:'原始材料质量',  RUS:''},
		{id:'Quality-of-Raw-Materials Info',  ENG:'an Elecsorries product attribute; an index from 1 to 22 defining quality of raw materials of a product; influences quality perception; affects product cost. ',  CHN:'',  RUS:''},
		{id:'Active agent',  ENG:'Active agent',  CHN:'活性剂',  RUS:''},
		{id:'Active agent Info',  ENG:'a Health/Beauties product attribute; an index from 1 to 20; influences performance perception; affects gentleness perception and product cost.',  CHN:'',  RUS:''},
		{id:'Smoothener Level',  ENG:'Smoothener Level',  CHN:'',  RUS:''},
		{id:'Smoothener Level Info',  ENG:'a Health/Beauties product attribute; an index from 1 to 20; influences gentleness perception; affects product cost.',  CHN:'',  RUS:''},
		{id:'Estimated Production Volume',  ENG:'Estimated Production Volume',  CHN:'',  RUS:''},
		{id:'Estimated Production Volume Info',  ENG:'used to calculate estimated product cost with given product composition; on step 2 you will have to put final decision on order. ',  CHN:'',  RUS:''},
		{id:'Discontinue this product',  ENG:'Discontinue this product',  CHN:'停止生产',  RUS:''},
		{id:'Discontinue this product Info',  ENG:'take this decision with caution: all unsold stocks of this product will be automatically returned to your warehouse and scrapped at a cost to your business.',  CHN:'',  RUS:''},
		{id:'DisContinue',  ENG:'DisContinue',  CHN:'',  RUS:''},
		{id:'Continue',  ENG:'Continue',  CHN:'',  RUS:''},
		{id:'Current Price BM',  ENG:'Current Price BM',  CHN:'',  RUS:''},
		{id:'Current Price BM Info',  ENG:'list price for brick&mortar trade in current period; applicable for new launches only.',  CHN:'',  RUS:''},
		{id:'Current Price Emall',  ENG:'Current Price Emall',  CHN:'',  RUS:''},
		{id:'Current Price Emall Info',  ENG:'list and wholesale price for eMall in current period; applicable for new launches only. ',  CHN:'',  RUS:''},
		{id:'New Product',  ENG:'New Product',  CHN:'',  RUS:''},
		{id:'Commit Portflio decision',  ENG:'Commit Portflio decision',  CHN:'',  RUS:''},
		{id:'Next',  ENG:'Next',  CHN:'',  RUS:''},
		{id:'Launch New Brand',  ENG:'Launch New Brand',  CHN:'',  RUS:''},
		{id:'Under Existed Brand',  ENG:'Add new product under existed Brand',  CHN:'',  RUS:''},
		{id:'Choose Catagory',  ENG:'Choose Catagory',  CHN:'',  RUS:''},
		{id:'Choose Brand',  ENG:'Choose Brand',  CHN:'',  RUS:''},
		{id:'Enter New Variant Name',  ENG:'Enter New Variant Name',  CHN:'',  RUS:''},
		{id:'Enter New Brand Name',  ENG:'Enter New Brand Name',  CHN:'',  RUS:''},
		{id:'Add',  ENG:'Add',  CHN:'',  RUS:''},
		{id:'Cancel',  ENG:'Cancel',  CHN:'',  RUS:''},
		/*history*/		
		{id:'Current period',  ENG:'Current period',  CHN:'',  RUS:''},
		{id:'Previous period',  ENG:'Previous period',  CHN:'',  RUS:''},
		{id:'Unit Cost',  ENG:'Unit Cost',  CHN:'',  RUS:''},
		{id:'Acquired Technology Level',  ENG:'Acquired Technology Level',  CHN:'',  RUS:''},
		{id:'Acquired Design Level',  ENG:'Acquired Design Level',  CHN:'',  RUS:''},
		{id:'Sales Volume',  ENG:'Sales Volume',  CHN:'',  RUS:''},
		{id:'Unit Production Cost',  ENG:'Unit Production Cost',  CHN:'',  RUS:''},
		{id:'Production Volume',  ENG:'Production Volume',  CHN:'',  RUS:''},
		{id:'Initial Inventory',  ENG:'Initial Inventory',  CHN:'',  RUS:''},
		/*producerstep2*/
		{id:'Production and pricing',  ENG:'Production and pricing',  CHN:'',  RUS:''},
		{id:'Production and pricing Info',  ENG:'Step 2 of 4, after you have finalized you product portfolio for coming period, you should tell the system volumes to be produced this period and wholesale prices for next period',  CHN:'',  RUS:''},
		{id:'Next Price BM',  ENG:'Next Price BM',  CHN:'',  RUS:''},
		{id:'Next Price BM Info',  ENG:'list price for brick&mortar trade in next period.',  CHN:'',  RUS:''},
		{id:'Next Price Emall',  ENG:'Next Price Emall',  CHN:'',  RUS:''},
		{id:'Next Price Emall Info',  ENG:'list and wholesale price for eMall in next period.',  CHN:'',  RUS:''},
		{id:'Step 2 of 4',  ENG:'Step 2 of 4',  CHN:'',  RUS:''},
		{id:'Production Volume Info',  ENG:'volume you order from your factory; check your production capacity for the limits of your order.',  CHN:'',  RUS:''},
		{id:'Back',  ENG:'Back',  CHN:'',  RUS:''},
		/*producer step 3*/
		{id:'Advertising',  ENG:'Advertising',  CHN:'',  RUS:''},
		{id:'Producer Advertising Info',  ENG:'Step 3 of 4, After setting production volumes and future wholesale prices you need to take some marketing decisions both market related and national.',  CHN:'',  RUS:''},
		{id:'Step 3 of 4',  ENG:'Step 3 of 4',  CHN:'',  RUS:''},
		{id:'Urban',  ENG:'Urban',  CHN:'',  RUS:''},
		{id:'Rural',  ENG:'Rural',  CHN:'',  RUS:''},
		{id:'brand awareness',  ENG:'brand awareness',  CHN:'',  RUS:''},
		{id:'brand visibility share',  ENG:'brand visibility share',  CHN:'',  RUS:''},
		{id:'Urban Advertising Off-Line',  ENG:'Urban Advertising Off-Line',  CHN:'',  RUS:''},
		{id:'Urban Advertising Off-Line Info',  ENG:'budget you spend to advertise your brands in conventional media (printed and TV) in Urban market.',  CHN:'',  RUS:''},
		{id:'Urban Traditional Trade Support',  ENG:'Urban Traditional Trade Support',  CHN:'',  RUS:''},
		{id:'Urban Traditional Trade Support Info',  ENG:'budget you invest to support of Traditional Trade in Urban market; it increases visibility of your brands at Traditional Trade. ',  CHN:'',  RUS:''},
		{id:'Rural Advertising Off-Line',  ENG:'Rural Advertising Off-Line',  CHN:'',  RUS:''},
		{id:'Rural Advertising Off-Line Info',  ENG:'budget you spend to advertise your brands in conventional media (printed and TV) in Rural market. ',  CHN:'',  RUS:''},
		{id:'Rural Traditional Trade Support',  ENG:'Rural Traditional Trade Support',  CHN:'',  RUS:''},
		{id:'Rural Traditional Trade Support Info',  ENG:'budget you invest to support of Traditional Trade in Rural market; it increases visibility of your brands at Traditional Trade. ',  CHN:'',  RUS:''},
		{id:'National advertising online',  ENG:'National advertising online',  CHN:'',  RUS:''},
		{id:'E-Mall visibility investment',  ENG:'E-Mall visibility investment',  CHN:'',  RUS:''},
		{id:'E-Mall visibility investment Info',  ENG:'budget invested in increasing visibility of your brands at eMall.',  CHN:'',  RUS:''},
		{id:'On-line Advertising',  ENG:'On-line Advertising',  CHN:'',  RUS:''},
		{id:'On-line Advertising Info',  ENG:'budget spent to advertise your brands on the Internet, including social media.',  CHN:'',  RUS:''},
		/*producer step 4*/
		{id:'Category Decision',  ENG:'Category Decision',  CHN:'',  RUS:''},
		{id:'Category Decision Info',  ENG:'Step 4 of 4, At last you have to make decisions influencing whole category. These decisions are long-term investments, that is why they are not taken from your limited operational budget, you borrow these investments from capital market at a cost. Keep in mind that your long-term investments increase your fixed assets and consequently costs of running business. ',  CHN:'',  RUS:''},
		{id:'Step 4 of 4',  ENG:'Step 4 of 4',  CHN:'',  RUS:''},
		{id:'in capacity change',  ENG:'Investment in Capacity Change',  CHN:'',  RUS:''},
		{id:'in capacity change Info',  ENG:"to extend your capacity you have to invest a period before it gets ready; current period extension is also possible but at 50% higher charge; your capacity increases your fixed assets and labor cost; you can't sell out or lease your capacity to other players.",  CHN:'',  RUS:''},
		{id:'improve Available Technology',  ENG:'Investment to improve Available Technology',  CHN:'',  RUS:''},
		{id:'improve Available Technology Info',  ENG:'applies to both categories; you start with level 7 and can increase it to 20 by the session end; increases your fixed assets.',  CHN:'',  RUS:''},
		{id:'improve Flexibility',  ENG:'Investment to improve Flexibility',  CHN:'',  RUS:''},
		{id:'improve Flexibility Info',  ENG:"applies to both categories; helps you to automatically adjust your production to correspond to orders placed by retailers; affects your fixed assets. ",  CHN:'',  RUS:''},
		{id:'improve Design Know-How',  ENG:'Investment to improve Design Know-How',  CHN:'',  RUS:''},
		{id:'improve Design Know-How Info',  ENG:'Health/Beauties; you start with level 7 and can increase it to 20 by the session end; increases your fixed assets.',  CHN:'',  RUS:''},
		{id:'Production capacity',  ENG:'Production capacity',  CHN:'',  RUS:''},
		{id:'Acquired production flexibility',  ENG:'Acquired production flexibility',  CHN:'',  RUS:''},
		/*retailer step 1*/
		{id:'Rteailer Advertising Info',  ENG:'Step 1 of 4, define your marketing investments. These investments are given to online and offline agencies that carry out marketing campaigns for you. You can also define what slogan your agency promotes for you, you just need to allocate your budget between three shopper perceptions (convenience, assortment and price) in such a way that dimension you promote most gets more money.',  CHN:'',  RUS:''},
		{id:'More information',  ENG:'More information',  CHN:'',  RUS:''},
		{id:'Convenience Off-line',  ENG:'Convenience Off-line',  CHN:'',  RUS:''},
		{id:'Convenience Off-line Info',  ENG:'budget you give offline advertising agencies to promote convenience of your store chain. ',  CHN:'',  RUS:''},
		{id:'Assortment Off-line',  ENG:'Assortment Off-line',  CHN:'',  RUS:''},
		{id:'Assortment Off-line Info',  ENG:'budget you give offline advertising agencies to promote assortment of your store chain. ',  CHN:'',  RUS:''},
		{id:'Price Off-line',  ENG:'Price Off-line',  CHN:'',  RUS:''},
		{id:'Price Off-line Info',  ENG:'budget you give offline advertising agencies to promote price level of your store chain. ',  CHN:'',  RUS:''},
		{id:'Convenience On-line',  ENG:'Convenience On-line',  CHN:'',  RUS:''},
		{id:'Convenience On-line Info',  ENG:'budget you give online advertising agencies to promote convenience of your store chain.',  CHN:'',  RUS:''},
		{id:'Assortment On-line',  ENG:'Assortment On-line',  CHN:'',  RUS:''},
		{id:'Assortment On-line Info',  ENG:'budget you give online advertising agencies to promote assortment of your store chain.',  CHN:'',  RUS:''},
		{id:'Price On-line',  ENG:'Price On-line',  CHN:'',  RUS:''},
		{id:'Price On-line Info',  ENG:'budget you give online advertising agencies to promote price level of your store chain. ',  CHN:'',  RUS:''},
		/*retailer step 2*/
		{id:'Market',  ENG:'Market',  CHN:'',  RUS:''},
		{id:'Market Info',  ENG:'Step 2 of 4, After completing national set of decisions, it would be logical to work on the decisions specific for each of the markets. They will be of a strategic essence and influence your store chain positioning on the market. ',  CHN:'',  RUS:''},
		{id:'In-store Service Level',  ENG:'In-store Service Level',  CHN:'',  RUS:''},
		{id:'In-store Service Level Info',  ENG:'one of the following BASE, FAIR, MEDIUM, ENHANCED, PREMIUM; represents integrally expenditures of a retail chain on its service (labor costs, equipment and fixtures, lighting, etc.); influences convenience and assortment directly and price perception in reverse',  CHN:'',  RUS:''},
		{id:'Elecssories Selling surface',  ENG:'Elecssories Selling surface',  CHN:'',  RUS:''},
		{id:'Elecssories Selling surface Info',  ENG:'you may decide to increase store space allocated for one category and decrease accordingly another; total space allocated to both categories should be 100%; you must not kill any category, provisionally minimum store space must be 35%, therefore maximum store space per category could be 65%.',  CHN:'',  RUS:''},
		{id:'HealthBeauty Selling surface',  ENG:'HealthBeauty Selling surface',  CHN:'',  RUS:''},
		{id:'HealthBeauty Selling surface Info',  ENG:'you may decide to increase store space allocated for one category and decrease accordingly another; total space allocated to both categories should be 100%; you must not kill any category, provisionally minimum store space must be 35%, therefore maximum store space per category could be 65%. ',  CHN:'',  RUS:''},
		{id:'Local Convenience Advertising',  ENG:'Local Convenience Advertising',  CHN:'',  RUS:''},
		{id:'Local Convenience Advertising Info',  ENG:'budget you spend to advertise your store chain locally (outdoors Advertising, leaflets); promotes convenience of your stores.',  CHN:'',  RUS:''},
		{id:'Local Assortment Advertising',  ENG:'Local Assortment Advertising',  CHN:'',  RUS:''},
		{id:'Local Assortment Advertising Info',  ENG:'budget you spend to advertise your store chain locally (outdoors advertising, leaflets); promotes assortment of your stores.',  CHN:'',  RUS:''},
		{id:'Local Price Advertising',  ENG:'Local Price Advertising',  CHN:'',  RUS:''},
		{id:'Local Price Advertising Info',  ENG:'budget you spend to advertise your store chain locally (outdoors advertising, leaflets); promotes price perception of your stores. ',  CHN:'',  RUS:''},
		{id:'Allocate Empty Place',  ENG:'Allocate Empty Place',  CHN:'',  RUS:''},
		{id:'Allocate Empty Place Info',  ENG:'Allocate Empty Place Info',  CHN:'',  RUS:''},
		{id:'Allocate',  ENG:'Allocate',  CHN:'',  RUS:''},
		{id:'No',  ENG:'No',  CHN:'',  RUS:''},
		/*retailer step 3*/
		{id:'Private Labels Composition',  ENG:'Private Labels Composition',  CHN:'',  RUS:''},
		{id:'Private Labels Composition Info',  ENG:'Step 3 of 4, At this step you have to think about and take your decision on the portfolio of your private labels. You start with one PL per category per market. You may have three PLs per category per market.',  CHN:'',  RUS:''},
		{id:'Unit Production Cost',  ENG:'Unit Production Cost',  CHN:'',  RUS:''},
		/*retailer step 4*/
		{id:'Order Pricing Shelf',  ENG:'Order, Pricing and Shelf Allocation',  CHN:'',  RUS:''},
		{id:'Order Pricing Shelf Info',  ENG:'Step 4 of 4, placing orders with suppliers, allocating shelf space, setting retail price and defining promotions for each brand (both supplier and private label) at each market.',  CHN:'',  RUS:''},
		{id:'Available ShelfSpace',  ENG:'Available ShelfSpace',  CHN:'',  RUS:''},
		{id:'Private Label',  ENG:'Private Label',  CHN:'',  RUS:''},
		{id:'List Price',  ENG:'List Price',  CHN:'',  RUS:''},
		{id:'Closing Inventory',  ENG:'Closing Inventory',  CHN:'',  RUS:''},
		{id:'Sales Volume at your store',  ENG:'Sales Volume at your store',  CHN:'',  RUS:''},
		{id:'Shelf Space at your store',  ENG:'Shelf Space at your store',  CHN:'',  RUS:''},
		{id:'Market Price at your store',  ENG:'Market Price at your store',  CHN:'',  RUS:''},
		{id:'Net Price at your store',  ENG:'Net Price at your store',  CHN:'',  RUS:''},
		{id:'weeks',  ENG:'weeks',  CHN:'',  RUS:''},
		{id:'Order Volume',  ENG:'Order Volume',  CHN:'',  RUS:''},
		{id:'Order Volume Info',  ENG:'volume your order from manufacturer; you need to take into account brand potential, your current stocks and negotiated volumes/discounts to make a balanced decision.',  CHN:'',  RUS:''},
		{id:'Shelf Space',  ENG:'Shelf Space',  CHN:'',  RUS:''},
		{id:'Shelf Space Info',  ENG:'you may give a brand 5% of shelf space minimum. ',  CHN:'',  RUS:''},
		{id:'Retail Price',  ENG:'Retail Price',  CHN:'',  RUS:''},
		{id:'Retail Price Info',  ENG:'your normal retail price which is the basis for promotional discounts. ',  CHN:'',  RUS:''},
		{id:'Promotions Frequency',  ENG:'Promotions Frequency',  CHN:'',  RUS:''},
		{id:'Promotions Frequency Info',  ENG:'number of weeks out of 26 in each period when you plan to make your promotion campaign effective.',  CHN:'',  RUS:''},
		{id:'Reduction Rate',  ENG:'Reduction Rate',  CHN:'',  RUS:''},
		{id:'Reduction Rate Info',  ENG:'discount percent off normal retail price effective during promotions.',  CHN:'',  RUS:''},
		{id:'Add Order',  ENG:'Add Order',  CHN:'',  RUS:''},
		{id:'Order Product',  ENG:'Order Product',  CHN:'',  RUS:''},
		{id:'Produced by',  ENG:'Produced by',  CHN:'',  RUS:''}
	]
}

