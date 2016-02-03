/** @jsx React.DOM */
var CONFIG = {
    sort: { column: "staff_id", order: "asc" },
    dataPerPage:5,
    columns: {
        _id: { name: "獎品編號"},
        staff_id:{name:"員工工號"},
        staff_name:{name:"員工姓名"},
        name: { name: "獎項名稱"}
    }
};

var WinnerTable = React.createClass({
    getInitialState: function() {
        console.log("getInitialState");
        return {
            items: this.props.initialItems || [],
            showItems:  [] ,
            prize:'員工獎',
            sort: this.props.config.sort || { column: "", order: "" },
            columns: this.props.config.columns
        };
    },
    componentWillMount: function() {
        console.log("componentWillMount");
        this.loadData(this.props.dataSource);

    },
    loadData: function(dataSource) {
        console.log("Load");
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

    componentWillReceiveProps:function(){
        //if(this.state.prize=='員工獎'){
        //    this.setState({prize: '敗部復活獎'});
        //    this.loadData(this.props.dataSource2);
        //}
        //else if(this.state.prize=='敗部復活獎'){
        //    this.setState({prize: '員工獎'});
        //    this.loadData(this.props.dataSource);
        //}
    },

    render: function() {
        console.log("render");
        var rows = [];
        var columnNames = this.columnNames();
        var sections = [];
        var rowsByGroup = [];
        var bg_white_Style = {
            'color' : '#000000',
            'background-color':"#FFFFFF"
        };


        var cell = function(x) {
            return columnNames.map(function(c) {
                if (c == 'staff_id')
                    return <td >{x[c].replace("A0","晶睿").replace("B0","睿緻").replace("E0","歐特斯").replace("F0","高譽")}</td>;
                else if (c == '_id')
                    return <td >{'第'+x[c]+'獎'}</td>;
                else if (c == 'name')
                    return <td >{x[c]}</td>;
                else
                    return <td >{x[c]}</td>;
            }, this);
        }.bind(this);


        this.state.items.forEach(function(item) {
            rows.push(
                <tr key={item.id}>
            { cell(item)}
                </tr>
            );
        }.bind(this));

        rawLen=rows.length;
        for(i=0;i<rawLen;i+=this.props.config.dataPerPage) {
            if(rows.length>=this.props.config.dataPerPage)
                rowsByGroup.push(rows.splice(0,this.props.config.dataPerPage));
            else if(rows.length<this.props.config.dataPerPage && rows.length>0)
                rowsByGroup.push(rows.splice(0,rows.length));
        }

        for(i=0;i<rowsByGroup.length;i++)
        {
            sections.push(
                <section >
                    <table style={bg_white_Style}>
                        <tbody>
                            {rowsByGroup[i]}
                        </tbody>
                    </table>
                </section>);
        }

        return (
        <div className="slides" >
            <h2>{this.state.prize}</h2>
        {sections}
        </div>
        );
    }
});



setInterval(function(){
    if(Reveal.isLastSlide())
    {
        Reveal.slide(0);
        React.renderComponent(<WinnerTable  dataSource={"/query/winner_list"}  dataSource2={"/query/winner_list"} config={CONFIG} />, document.getElementById("Marquee"));
    }
    else{
        Reveal.next();
    }
}, 5000);

$(document).ready(function() {

    if(document.getElementById("Marquee")){
        React.render(<WinnerTable  dataSource={"/query/winner_list"}  dataSource2={"/query/winner_list"} config={CONFIG} />,
            document.getElementById("Marquee"));
    }

    Reveal.initialize({
        width: 1600,
        height: 700,
        controls: false,
        progress: true,
        history: true,
        center: true,
        parallaxBackgroundImage:  '/images/slideshow_bg.jpg',
        transition: 'concave' // none/fade/slide/convex/concave/zoom
    });

});

