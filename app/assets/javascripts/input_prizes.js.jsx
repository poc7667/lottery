/** @jsx React.DOM */

var CONFIG = {
    sort: {column: "_id", order: "desc"},
    numberOfBallot:12,
    columns: {
        _id: {name: "獎品序號"},
        staff_id: {name: "得獎人工號"},
        name: {name: "獎品"},
        staff_name: {name: "得獎人姓名"}
    }
};

var TableSorter = React.createClass({
    getInitialState: function () {
        return {
            summaryForInput:this.props.initialItems || [],
            staffs: this.props.initialItems || [],
            sort: this.props.config.sort || {column: "", order: ""},
            columns: this.props.config.columns,
            numberOfBallot: this.props.config.numberOfBallot
        };
    },
    componentWillMount: function () {
        this.loadData(this.props.summarySource,'Summary For Input');
        this.loadData(this.props.staffsSource,'Staffs');
    },

    loadData:function(Source,type)
    {
        if (!Source) return;

        $.get(Source).done(function (data) {
            console.log("Received "+type);
            var sortedItems = _.sortBy(data, this.state.sort.column);
            if (this.state.sort.order === "desc") sortedItems.reverse();
            if(type=='Summary For Input')
                this.setState({summaryForInput: this.notYetEnteredPrizeFilter(sortedItems)});
            else if(type=='Staffs')
                this.setState({staffs: data});
        }.bind(this)).fail(function (error, a, b) {
            console.log("Error loading" +type );
        });
    },

    inputColumnNames: function () {
        return Object.keys(this.state.columns);
    },

    notYetEnteredPrizeFilter: function(list){
        return   _.filter(list,function(column){
            return !column['staff_name'] && !column['staff_id']
        },this);
    },

    register:function(stuff_id,prize_id,type){
        dataSource='/register/'+prize_id+'/'+stuff_id;
        $.getJSON(dataSource).done(function(data) {
            if(data['status']=='fail')
                this.setNameByStuffID(this.state.summaryForInput,stuff_id.toUpperCase(),prize_id,'重複的中獎人');
            else
            {
                this.setState({summaryForInput: this.notYetEnteredPrizeFilter(this.state.summaryForInput)});
                console.log(type+" success");
            }
        }.bind(this)).fail(function(error, a, b) {
            console.log("Error :"+type);
        });
    },

    findColumnByPrizeID:function(list,id){
        return _.find(list,function(column){return column['_id']==id});
    },

    setColumn:function(column,staff_name,staff_id,registered_at){
        if(staff_name!='')
            column['staff_name']=staff_name
        if(staff_id!='')
            column['staff_id']=staff_id
        if(registered_at!='')
            column['registered_at']=registered_at
    },

    setNameByStuffID:function(list,stuff_id,prize_id,stuff_name){
        this.state.staffs.forEach(function(staffsColumn){
            if (staffsColumn['_id']==stuff_id)
            {
                if(typeof stuff_name== 'undefined')
                    stuff_name=staffsColumn['name'];
                summaryColumn=this.findColumnByPrizeID(list,prize_id);
                this.setColumn(summaryColumn,stuff_name,stuff_id,"");
                this.setState();
            }

        }, this)
    },

    handleStaffInputTextChange: function (event){
        stuff_id=event.target.value;
        prize_id=event.target.name;
        this.setNameByStuffID(this.state.summaryForInput,stuff_id.toUpperCase(),prize_id);
    },

    handleInputSubmit: function (event) {
        event.preventDefault();
        stuff_id=event.target.childNodes[0].value;
        prize_id=event.target.childNodes[0].name;
        this.register(stuff_id.toUpperCase(),prize_id,"Input prize");
        event.target.childNodes[0].value='';
    },

    render: function () {
        var inputRows = [];
        var inputColumnNames = this.inputColumnNames();
        var red_Style = {'color' : 'red'};
        var inputCell = function (x) {
            return inputColumnNames.map(function (c) {
                if (c == 'staff_id')
                    return <td>
                        <form onSubmit={this.handleInputSubmit}>
                            <input type="text" name={x['_id']}  defaultValue={x[c]} onChange={this.handleStaffInputTextChange}  />
                        </form>
                    </td>;
                else if(c == 'staff_name' && x[c]=='重複的中獎人')
                    return <td style={red_Style} >{x[c]}</td>;
                else
                    return <td>{x[c]}</td>;
            }, this);
        }.bind(this);

        numberOfBallot=0;
        if(this.state.summaryForInput.length>this.state.numberOfBallot)
            numberOfBallot=this.state.numberOfBallot;
        else
            numberOfBallot=this.state.summaryForInput.length;

        if(this.state.summaryForInput.length>0)
        {
            for(i=0;i<numberOfBallot;i++)
            {
                inputRows.push(
                    <tr >
                    { inputCell(this.state.summaryForInput[i]) }
                    </tr>
                );
            }
        }

        var inputHeader = inputColumnNames.map(function (c) {
            return <th>{this.state.columns[c].name}</th>;
        }, this);

        return (
            <div>
                <header className="panel-heading">輸入獎項</header>
                <div className="table">
                    <table cellSpacing="0" className="table table-striped table-advance table-hover">
                        <thead>
                            <tr>
                            { inputHeader }
                            </tr>
                        </thead>
                        <tbody>
                            { inputRows }
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


if(document.getElementById("input_prizes"))
    React.renderComponent(<App />, document.getElementById("input_prizes"));
