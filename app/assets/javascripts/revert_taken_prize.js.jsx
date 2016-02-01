/** @jsx React.DOM */

var CONFIG = {
    sort: {column: "_id", order: "desc"},
    columns: {
        _id: {name: "獎品序號"},
        staff_id: {name: "得獎人工號"},
        name: {name: "獎品"},
        can_accept_prize_now: {name: "當場領取"},
        taken_at: {name: "是否領取"},
        staff_name: {name: "得獎人姓名"},
        registered_at: {name: "得獎時間"}
    }
};

var TableSorter = React.createClass({
    getInitialState: function () {
        return {
            summary: this.props.initialItems || [],
            staffs: this.props.initialItems || [],
            sort: this.props.config.sort || {column: "", order: ""},
            columns: this.props.config.columns
        };
    },
    componentWillMount: function () {
        this.loadData(this.props.summarySource,'Summary');
        this.loadData(this.props.staffsSource,'Staffs');
    },

    loadData:function(Source,type)
    {
        if (!Source) return;

        $.get(Source).done(function (data) {
            console.log("Received "+type);
            var sortedItems = _.sortBy(data, this.state.sort.column);
            if (this.state.sort.order === "desc") sortedItems.reverse();
            if(type=='Summary')
                this.setState({summary: sortedItems});
            else if(type=='Staffs')
                this.setState({staffs: data});
        }.bind(this)).fail(function (error, a, b) {
            console.log("Error loading" +type );
        });
    },

    editColumnNames: function () {
        return Object.keys(this.state.columns);
    },


    take_prize:function(event){
        name_staff=event.target.name.split(',')

        dataSource='/take/'+name_staff[0]+'/'+name_staff[1];
        $.getJSON(dataSource).done(function() {
            console.log("Take success");
        }.bind(this)).fail(function(error, a, b) {
            console.log("Error :Take Prize");
        });

        itemsColumn=_.find(this.state.summary,function(column){return column['_id']==name_staff[0]});
        itemsColumn['taken_at']=true;
        this.setState()

    },

    untake_prize:function(event){
        name_staff=event.target.name.split(',')

        dataSource='/untake/'+name_staff[0]+'/'+name_staff[1];
        $.getJSON(dataSource).done(function() {
            console.log("Untake success");
        }.bind(this)).fail(function(error, a, b) {
            console.log("Error :Untake Prize");
        });

        itemsColumn=_.find(this.state.summary,function(column){return column['_id']==name_staff[0]});
        itemsColumn['taken_at']=false;
        this.setState()

    },


    render: function () {
        var editRows = [];
        var editColumnNames = this.editColumnNames();
        var red_Style = {'color' : 'red'};

        var editCell = function (x) {
            return editColumnNames.map(function (c) {
                 if (c == 'can_accept_prize_now') {
                    if (x[c] )
                        return <td>
                            <img src="/images/check.png"></img>
                        </td>;
                    else
                        return <td>
                            <img src="/images/cross.png"></img>
                        </td>;
                }
                else if (c == 'taken_at') {
                    if (x[c])
                        return <td>
                            <button name={x['_id']+','+x['staff_id']} className="btn btn-shadow btn-danger" onClick={this.untake_prize}>已領取</button>
                        </td>;
                    else
                        return <td>
                            <button name={x['_id']+','+x['staff_id']} className="btn btn-shadow btn-success" onClick={this.take_prize}>未領取</button>
                        </td>;
                }
                else if(c == 'staff_name' && x[c]=='重複的中獎人')
                    return <td style={red_Style} >{x[c]}</td>;
                else
                    return <td>{x[c]}</td>;
            }, this);
        }.bind(this);
        this.state.summary.forEach(function (item) {
            editRows.push(
                <tr key={item.id}>
          { editCell(item) }
                </tr>
            );
        }.bind(this));

        var editHeader = editColumnNames.map(function (c) {
            return <th>{this.state.columns[c].name}</th>;
        }, this);

        return (
            <div>
                <header className="panel-heading">撤銷已領取名單</header>
                <div className="table">
                    <table cellSpacing="0" className="table table-striped table-advance table-hover">
                        <thead>
                            <tr>
                                { editHeader }
                            </tr>
                        </thead>
                        <tbody>
                            { editRows }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

var App = React.createClass({
    render: function () {
        return (
            <div>
                <TableSorter staffsSource={"/query/staffs"} summarySource={"/query/summary"}  config={CONFIG} />
            </div>
        );
    }
});


if(document.getElementById("revert_taken_prize"))
    React.renderComponent(<App />, document.getElementById("revert_taken_prize"));






