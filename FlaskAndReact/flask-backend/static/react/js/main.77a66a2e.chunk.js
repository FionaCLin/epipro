(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{102:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(19),c=a.n(r),i=(a(75),a(8)),o=a(9),s=a(11),u=a(10),m=a(12),h=a(28),p=a(26),d=a(53),b=a.n(d),v=(a(16),function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{className:"App"},l.a.createElement("div",{className:"bg"},l.a.createElement("header",{className:"App-header"},l.a.createElement("img",{src:b.a,className:"App-logo",alt:"logo"}),l.a.createElement("p",null,"EpiPro API"),l.a.createElement("p",null,"Predict. Prevent. Protect."),l.a.createElement("a",{href:"https://epiproapp.appspot.com/api/doc/"},"EpiPro API Documentation"),l.a.createElement(h.b,{to:"/search"},"Search"))))}}]),t}(l.a.Component)),E=a(33),f=a(107),y=a(109),O=a(103),j=a(108),x=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={title:""},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"handleChange",value:function(e){e.preventDefault(),this.setState({title:e.target.value}),this.props.updateTitle({title:e.target.value})}},{key:"render",value:function(){var e=this;return l.a.createElement(O.a,{className:"mb-3"},l.a.createElement(j.a,{placeholder:"Title search",type:"text",onChange:function(t){return e.handleChange(t)},value:this.state.title}),l.a.createElement(O.a.Append,null,l.a.createElement(f.a,null,"Search")))}}]),t}(l.a.Component),k=a(69),C=a(57),g=a(58),D=function(e){function t(e){var a;Object(i.a)(this,t),a=Object(s.a)(this,Object(u.a)(t).call(this,e));var n={keyterms:C,locations:g}[a.props.type];return a.state={values:[],filterOptions:n},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"handleChange",value:function(e){var t=e.map(function(e){return e.value});this.setState({values:t});var a={};a[this.props.type]=t,this.props.updateFilter(a)}},{key:"makeLabel",value:function(e){var t=e.charAt(0).toUpperCase()+e.slice(1);return t=t.substr(0,t.length-1)}},{key:"render",value:function(){var e=this,t="Select "+this.props.type+"...",a=this.makeLabel(this.props.type);return l.a.createElement("div",{className:"Filter-element"},l.a.createElement("b",null,a),l.a.createElement(k.a,{isMulti:!0,options:this.state.filterOptions,className:"basic-multi-select",classNamePrefix:"select",placeholder:t,onChange:function(t){return e.handleChange(t)}}))}}]),t}(l.a.Component),N=a(40),w=a(27),T=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={startDate:null,endDate:null,maxDate:new Date,minDate:null},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"handleChange",value:function(e,t){var a={};a[t]=e,console.log(e),this.setState(a),this.changeMinMaxDate(e,t),this.props.updateTime(a)}},{key:"changeMinMaxDate",value:function(e,t){var a={minDate:null,maxDate:new Date};Object(w.isNull)(e)||("startDate"==t?a.minDate=e:a.maxDate=e),this.setState(a)}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"Filter-element"},l.a.createElement("div",null,l.a.createElement("b",null,"Date Range")),l.a.createElement("div",{className:"Filter-inline-1"},l.a.createElement(N.a,{selected:this.state.startDate,selectsStart:!0,startDate:this.state.startDate,endDate:this.state.endDate,dateFormat:"dd/MM/yyyy",minDate:this.state.minDate,maxDate:this.state.maxDate,onChange:function(t){return e.handleChange(t,"startDate")},placeholderText:"Start Date"})),l.a.createElement("div",{className:"Time-between"},"to"),l.a.createElement("div",{className:"Filter-inline-2"},l.a.createElement(N.a,{selected:this.state.endDate,selectsEnd:!0,startDate:this.state.startDate,endDate:this.state.endDate,dateFormat:"dd/MM/yyyy",minDate:this.state.minDate,maxDate:new Date,onChange:function(t){return e.handleChange(t,"endDate")},placeholderText:"End Date"})))}}]),t}(l.a.Component),F=a(105),_=a(23),S=a(106),A=function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement(h.b,{to:"/article",className:"link"},l.a.createElement(S.a,null,l.a.createElement("div",{className:"Card-hover"},l.a.createElement(S.a.Body,null,l.a.createElement(S.a.Title,{className:"Card-title"},l.a.createElement("h3",null,this.props.headline)),l.a.createElement(S.a.Subtitle,{className:"mb-2 text-muted"},l.a.createElement("i",null,this.props.url," \u2022 ",this.props.date_of_publication)),l.a.createElement(S.a.Text,null,this.props.main_text))))))}}]),t}(l.a.Component),L=function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement(F.a,{variant:"flush"},l.a.createElement(F.a.Item,null,l.a.createElement(A,_)))}}]),t}(l.a.Component),M=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={title:"",keyterms:[],locations:[],startDate:null,endDate:null,advancedFilter:!1},a.handleChange=a.handleChange.bind(Object(E.a)(a)),a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"handleChange",value:function(e){this.setState(e),console.log(e)}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"Main"},l.a.createElement("h1",null,"SEARCH"),l.a.createElement("div",null,l.a.createElement(x,{updateTitle:this.handleChange})),l.a.createElement(f.a,{onClick:function(){return e.handleChange({advancedFilter:!e.state.advancedFilter})},"aria-controls":"collapse-filters","aria-expanded":this.state.advancedFilter,variant:"secondary",size:"sm",block:!0},"Advanced Filters"),l.a.createElement(y.a,{in:this.state.advancedFilter},l.a.createElement("div",{id:"collapse-filters",className:"Filter-panel"},l.a.createElement(D,{type:"keyterms",updateFilter:this.handleChange}),l.a.createElement(D,{type:"locations",updateFilter:this.handleChange}),l.a.createElement(T,{updateTime:this.handleChange}),l.a.createElement("div",{className:"Filter-button"},l.a.createElement(f.a,null,"Advanced Search")))),l.a.createElement("div",{className:"ArticleList-division"}),l.a.createElement(L,null))}}]),t}(l.a.Component),P=a(104),R=function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"LocationCheck",value:function(e){return Object(w.isNullOrUndefined)(e["geonames-id"])?l.a.createElement("p",null,l.a.createElement("b",null,"Location:")," ",e.location,", ",e.country):l.a.createElement("p",null,l.a.createElement("b",null,"Location:")," ",e["geonames-id"])}},{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("p",null,l.a.createElement("b",null,"Type: "),l.a.createElement(P.a,{className:"Badge-division",variant:"secondary"},this.props.type)),l.a.createElement("p",null,l.a.createElement("b",null,"Date:")," ",this.props.date),this.LocationCheck(this.props.location),l.a.createElement("p",null,l.a.createElement("b",null,"Number Affected:")," ",this.props["number-affected"]))}}]),t}(l.a.Component),B=function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("p",null,l.a.createElement("b",null,"Event Reports:")),this.props.reports.map(function(e){return l.a.createElement("div",{className:"EventReport-division"},l.a.createElement(S.a,null,l.a.createElement(S.a.Body,{className:"EventReport-card"},l.a.createElement(R,e))))}))}}]),t}(l.a.Component),I=function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"ListCheck",value:function(e,t){var a=null;return Object(w.isNull)(e)||0==e.length||(a=e.map(function(e){return l.a.createElement(P.a,{className:"Badge-division",variant:"secondary"},e)}),a=l.a.createElement("p",null,l.a.createElement("b",null,t,":")," ",a)),a}},{key:"CommentCheck",value:function(e){return Object(w.isNull)(e)?null:l.a.createElement("p",null,l.a.createElement("b",null,"Comments:")," ",e)}},{key:"render",value:function(){var e=0!=this.props.reported_events.length?l.a.createElement(B,{reports:this.props.reported_events}):null;return l.a.createElement("div",null,this.ListCheck(this.props.disease,"Disease"),this.ListCheck(this.props.syndrome,"Syndrome"),e,this.CommentCheck(this.props.comment))}}]),t}(l.a.Component),H=function(e){function t(e){var a;return Object(i.a)(this,t),a=Object(s.a)(this,Object(u.a)(t).call(this,e)),console.log(a.props.reports),a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{className:"ReportList-division"},l.a.createElement("h3",null,"Reports"),l.a.createElement(F.a,null,this.props.reports.map(function(e){return l.a.createElement(F.a.Item,null,l.a.createElement(I,e))})))}}]),t}(l.a.Component),z=function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{className:"Main"},l.a.createElement("h1",null,this.props.headline),l.a.createElement("p",null,l.a.createElement("i",null,"URL: ",l.a.createElement("a",{href:this.props.url},this.props.url))),l.a.createElement("p",null,l.a.createElement("i",null,"DOP: ",this.props.date_of_publication)),l.a.createElement("p",null,this.props.main_text),l.a.createElement(H,{reports:this.props.reports}))}}]),t}(l.a.Component);z.defaultProps={url:_.url,date_of_publication:_.date_of_publication,headline:_.headline,main_text:_.main_text,reports:_.reports};var U=function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("main",null,l.a.createElement(h.a,null,l.a.createElement(p.c,null,l.a.createElement(p.a,{exact:!0,path:"/",component:v}),l.a.createElement(p.a,{path:"/search",component:M}),l.a.createElement(p.a,{path:"/article",component:z}))))}}]),t}(n.Component);a(100),a(101);c.a.render(l.a.createElement(U,null),document.getElementById("root"))},16:function(e,t,a){},23:function(e){e.exports={url:"www.who.int/lalala",date_of_publication:"2018-12-12Txx:xx:xx",headline:"Outbreaks in Southern Vietnam",main_text:"Three people infected by what is thought to be H5N1 or H7N9 in Ho Chi Minh city. First infection occurred on 1 Dec 2018, and latest is report on 10 December. Two in hospital, one has recovered. Furthermore, two people with fever and rash infected by an unknown disease.",reports:[{disease:["influenza a/h5n1","influenza a/h7n9"],syndrome:[],reported_events:[{type:"recovered",date:"2018-12-01Txx:xx:xx to 2018-12-10Txx:xx:xx",location:{"geonames-id":1566083},"number-affected":1},{type:"hospitalised",date:"2018-12-01Txx:xx:xx to 2018-12-10Txx:xx:xx",location:{"geonames-id":1566083},"number-affected":2}],comment:null},{disease:["unknown"],syndrome:["Acute fever and rash"],reported_events:[{type:"infected",date:"2018-12-01Txx:xx:xx to 2018-12-10Txx:xx:xx",location:{"geonames-id":1566083},"number-affected":2}],comment:null}]}},53:function(e,t,a){e.exports=a.p+"media/logo.bf63f469.png"},57:function(e){e.exports=[{value:"keyterm1",label:"keyterm1"},{value:"keyterm2",label:"keyterm2"},{value:"keyterm3",label:"keyterm3"},{value:"keyterm4",label:"keyterm4"},{value:"keyterm5",label:"keyterm5"},{value:"keyterm6",label:"keyterm6"},{value:"keyterm7",label:"keyterm7"},{value:"keyterm8",label:"keyterm8"},{value:"keyterm9",label:"keyterm9"},{value:"keyterm10",label:"keyterm10"}]},58:function(e){e.exports=[{value:"location1",label:"location1"},{value:"location2",label:"location2"},{value:"location3",label:"location3"},{value:"location4",label:"location4"},{value:"location5",label:"location5"},{value:"location6",label:"location6"},{value:"location7",label:"location7"},{value:"location8",label:"location8"},{value:"location9",label:"location9"},{value:"location10",label:"location10"}]},70:function(e,t,a){e.exports=a(102)},75:function(e,t,a){}},[[70,1,2]]]);
//# sourceMappingURL=main.77a66a2e.chunk.js.map