
// WinnerTable Config
var CONFIG = {
    sort: { column: "staff_id", order: "asc" },
    dataPerPage:5,
    reflashTime:5000,
    columns: {
        _id: { name: "獎品編號"},
        name: { name: "獎項名稱"},
        staff_id:{name:"員工工號"},
        staff_name:{name:"員工姓名"}
    }
};


// WinnerTable React Component
var WinnerTable = React.createClass({
    getInitialState: function() {
        return {
            items: this.props.initialItems || [],
            showItems:  [] ,
            prize:'normal',
            sort: this.props.config.sort || { column: "", order: "" },
            columns: this.props.config.columns
        };
    },
    componentWillMount: function() {
        this.loadData(this.props.dataSource);
    },
    loadData: function(dataSource) {
        if (!dataSource) return;

        $.getJSON(dataSource).done(function(data) {
            console.log("Received data");
            var sortedItems = _.sortBy(data, this.state.sort.column);
            if (this.state.sort.order === "desc") sortedItems.reverse();
            return this.setState({items: sortedItems});
        }.bind(this)).fail(function(error, a, b) {
            console.log("Error loading JSON");
        });
    },


    columnNames: function() {
        return Object.keys(this.state.columns);
    },

    sortClass: function(column) {
        var ascOrDesc = (this.state.sort.order == "asc") ? "headerSortAsc" : "headerSortDesc";
        return (this.state.sort.column == column) ? ascOrDesc : "";
    },
    componentDidMount: function() {
        console.log("componentDidMount");
        setInterval(this.showItem, this.props.config.reflashTime);
    },

    showItem: function(){
        if(this.state.items.length>=this.props.config.dataPerPage){
            templist=this.state.items.splice(0,this.props.config.dataPerPage)
            this.setState({showItems: templist});
        }
        else if(this.state.items.length==0){
            if(this.state.prize=='normal'){
                this.setState({prize: 'special'});
                this.loadData(this.props.dataSource2);
            }
            else if(this.state.prize=='special'){
                this.setState({prize: 'normal'});
                this.loadData(this.props.dataSource);
            }
        }
        else if(0<this.state.items.length<this.props.config.dataPerPage){
            this.setState({showItems: this.state.items.splice(0,this.state.items.length)});
        }
    },

    render: function() {
        console.log("render");
        var rows = [];
        var columnNames = this.columnNames();

        var cell = function(x) {
            return columnNames.map(function(c) {
                 if (c == 'staff_id') {
                    if (x[c] )
                        return <td>{x[c].replace("A0","晶睿").replace("B0","睿緻")}</td>;
                    else
                        return <td>
                            <img src="/images/cross.png"></img>
                        </td>;
                }
                else
                    return <td>{x[c]}</td>;
            }, this);
        }.bind(this);


        this.state.showItems.forEach(function(item) {
                rows.push(
                <tr key={item.id}>
            { cell(item) }
            </tr>
        );
    }.bind(this));


var header = columnNames.map(function(c) {
    return <th  className={"header " + this.sortClass(c)}>{this.state.columns[c].name}</th>;
}, this);
        { console.log(header) }
return (
    <div>
    <div>{this.state.prize}</div>
    <div className="table">
        <table cellSpacing="0" className="tablesorter">
            <thead>
                <tr>
                    { header }

                </tr>
            </thead>
            <tbody>
                { rows }
            </tbody>
        </table>
    </div>

</div>
);
}
});


var Marquee = React.createClass({
    render: function() {
        return (
            <div>
            <WinnerTable  dataSource={"/query/winner_list"}  dataSource2={"/query/winner_list"} config={CONFIG} />
        </div>
        );
    }
});

React.renderComponent(<Marquee />, document.getElementById("Marquee"));
