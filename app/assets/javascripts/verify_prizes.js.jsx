///** @jsx React.DOM */
//
//var CONFIG = {
//    sort: {column: "_id", order: "desc"},
//    columns: {
//        _id: {name: "獎品序號"},
//        staff_id: {name: "得獎人工號"},
//        name: {name: "獎品"},
//        can_accept_prize_now: {name: "當場領取"},
//        taken_at: {name: "是否領取"},
//        staff_name: {name: "得獎人姓名"},
//        registered_at: {name: "得獎時間"}
//    }
//};
//
//var TableSorter = React.createClass({
//    getInitialState: function () {
//        return {
//            summary: this.props.initialItems || [],
//            staffs: this.props.initialItems || [],
//            sort: this.props.config.sort || {column: "", order: ""},
//            columns: this.props.config.columns
//        };
//    },
//    componentWillMount: function () {
//        this.loadData(this.props.summarySource,'Summary For Edit');
//        this.loadData(this.props.staffsSource,'Staffs');
//        var that = this;
//        $(document).ready(function(){
//          var source = new EventSource('/welcome/new_prizes_stream');
//          source.addEventListener('messages.create', function(e) {
//            var message = JSON.parse(e.data);
//            });
//        });
//    },
//
//
//    loadData:function(Source,type)
//    {
//        if (!Source) return;
//
//        $.get(Source).done(function (data) {
//            console.log("Received "+type);
//            var sortedItems = _.sortBy(data, this.state.sort.column);
//            if (this.state.sort.order === "desc") sortedItems.reverse();
//            if(type=='Summary For Edit')
//                this.setState({summary: sortedItems});
//            else if(type=='Staffs')
//                this.setState({staffs: data});
//        }.bind(this)).fail(function (error, a, b) {
//            console.log("Error loading" +type );
//        });
//    },
//
//    editColumnNames: function () {
//        return Object.keys(this.state.columns);
//    },
//
//    register:function(stuff_id,prize_id,type){
//        dataSource='/register/'+prize_id+'/'+stuff_id;
//        $.getJSON(dataSource).done(function(data) {
//            if(data['status']=='fail')
//                this.setNameByStuffID(this.state.summary,stuff_id.toUpperCase(),prize_id,'重複的中獎人');
//            else
//                console.log(type+" success");
//        }.bind(this)).fail(function(error, a, b) {
//            console.log("Error :"+type);
//        });
//    },
//
//    findColumnByPrizeID:function(list,id){
//        return _.find(list,function(column){return column['_id']==id});
//    },
//
//    setColumn:function(column,staff_name,staff_id,registered_at){
//        if(staff_name!='')
//            column['staff_name']=staff_name;
//        if(staff_id!='')
//            column['staff_id']=staff_id;
//        if(registered_at!='')
//            column['registered_at']=registered_at
//    },
//
//    setDataByNotification:function(context,message){
//        summaryColumn=context.findColumnByPrizeID(context.state.summary,message['prize']['_id']);
//        summaryColumn['staff_id']=message['prize']['staff_id'];
//        summaryColumn['can_accept_prize_now']=message['prize']['can_accept_prize_now'];
//        summaryColumn['taken_at']=message['prize']['taken_at'];
//        summaryColumn['staff_name']=message['staff']['name'];
//        summaryColumn['registered_at']=message['prize']['registered_at'];
//        context.setState();
//    },
//
//    setNameByStuffID:function(list,stuff_id,prize_id,stuff_name){
//        this.state.staffs.forEach(function(staffsColumn){
//            if (staffsColumn['_id']==stuff_id)
//            {
//                if(typeof stuff_name== 'undefined')
//                    stuff_name=staffsColumn['name'];
//                summaryColumn=this.findColumnByPrizeID(list,prize_id);
//                this.setColumn(summaryColumn,stuff_name,stuff_id,"");
//                this.setState()
//            }
//        }, this)
//    },
//
//    handleStaffEditTextChange: function (event){
//        stuff_id=event.target.value;
//        prize_id=event.target.name;
//
//        //make input could edited by user
//        this.state.summary.forEach(function(summaryColumn){
//            if(summaryColumn['_id']==prize_id)
//            {
//                summaryColumn['staff_id']=stuff_id;
//                this.setState()
//            }
//        },this);
//
//        this.setNameByStuffID(this.state.summary,stuff_id.toUpperCase(),prize_id);
//    },
//
//
//    handleEditSubmit: function (event) {
//        event.preventDefault();
//        stuff_id=event.target.childNodes[0].value;
//        prize_id=event.target.childNodes[0].name;
//        this.register(stuff_id,prize_id,"Edit prize");
//    },
//
//
//    render: function () {
//        var editRows = [];
//        var editColumnNames = this.editColumnNames();
//        var red_Style = {'color' : 'red'};
//
//        var editCell = function (x) {
//            return editColumnNames.map(function (c) {
//                if (c == 'staff_id')
//                    return <td>
//                        <form onSubmit={this.handleEditSubmit}>
//                            <input type="text" name={x['_id']} value={x[c]}  onChange={this.handleStaffEditTextChange}  />
//                        </form>
//                    </td>;
//                else if (c == 'can_accept_prize_now') {
//                    if (x[c] )
//                        return <td>
//                            <img src="/images/check.png"></img>
//                        </td>;
//                    else
//                        return <td>
//                            <img src="/images/cross.png"></img>
//                        </td>;
//                }
//                else if (c == 'taken_at') {
//                    if (x[c])
//                        return <td>
//                            <span className="label label-danger label-mini">已領取</span>
//                        </td>;
//                    else
//                        return <td>
//                            <span className="label label-success label-mini">未領取</span>
//                        </td>;
//                }
//                else if(c == 'staff_name' && x[c]=='重複的中獎人')
//                    return <td style={red_Style} >{x[c]}</td>;
//                else
//                    return <td>{x[c]}</td>;
//            }, this);
//        }.bind(this);
//        this.state.summary.forEach(function (item) {
//            editRows.push(
//                <tr key={item.id}>
//          { editCell(item) }
//                </tr>
//            );
//        }.bind(this));
//
//        var editHeader = editColumnNames.map(function (c) {
//            return <th>{this.state.columns[c].name}</th>;
//        }, this);
//
//        return (
//            <div>
//                <header className="panel-heading">編輯獎項</header>
//                <div className="table">
//                    <table cellSpacing="0" className="table table-striped table-advance table-hover">
//                        <thead>
//                            <tr>
//                                { editHeader }
//                            </tr>
//                        </thead>
//                        <tbody>
//                            { editRows }
//                        </tbody>
//                    </table>
//                </div>
//            </div>
//        );
//    }
//});
//
//var App = React.createClass({
//    render: function () {
//        return (
//            <div>
//                <TableSorter staffsSource={"/query/staffs"} summarySource={"/query/summary"}  config={CONFIG} />
//            </div>
//        );
//    }
//});
//
//
//if(document.getElementById("verify_prizes"))
//    React.renderComponent(<App />, document.getElementById("verify_prizes"));
//
//
//
//
//
//
