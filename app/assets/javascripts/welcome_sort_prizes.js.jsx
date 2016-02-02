//require('react-dom');

var CONFIG = {
  sort: { column: "_id", order: "desc" },
  filterText: "",
  columns: {
    _id: { name: "獎品序號"},
    name: { name: "獎品"},
    can_accept_prize_now: { name: "當場領取"},
    taken_at: {name: "是否領取"},
    staff_name: {name: "得獎人姓名"},
    staff_id: {name: "得獎人工號"},
    registered_at: {name: "得獎時間"}
  }
};


var TableSorter = React.createClass({
  getInitialState: function() {
    return {
      items: this.props.initialItems || [],
      sort: this.props.config.sort || { column: "", order: "" },
      columns: this.props.config.columns,
      filterText:this.props.config.filterText
    };
  },

  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.dataSource,
      dataType: "json",
      success: function(data) {
        this.setState({items: data});
      }.bind(this)
    });
  },

  componentWillMount: function() {
    this.loadData(this.props.dataSource);
    setInterval(this.loadCommentsFromServer, 5000);
  },
  loadData: function(dataSource) {
    if (!dataSource) return;

    $.get(dataSource).done(function(data) {
      console.log("Received data");
      this.setState({items: data});
    }.bind(this)).fail(function(error, a, b) {
      console.log("Error loading JSON");
    });
  },
  handleFilterTextChange: function (event){
    this.setState({filterText:event.target.value})
  },
  editColumnNames: function() {
     return Object.keys(this.state.columns); 
  },

  untake_prize:function(event){
    name_staff=event.target.name.split(',')

    dataSource='/take/'+name_staff[0]+'/'+name_staff[1];
    $.getJSON(dataSource).done(function() {
      console.log("Input success");
    }.bind(this)).fail(function(error, a, b) {
      console.log("Error :Input Prize");
    });

    itemsColumn=_.find(this.state.items,function(column){return column['_id']==name_staff[0]});
    itemsColumn['taken_at']=true;
    this.setState()

  },
  render: function() {
    var rows = [];
    var columnNames = this.editColumnNames();
    var filters = {};

    columnNames.forEach(function(column) {
      var filterText = this.state.filterText;
      filters[column] = null;

      if (filterText.length > 0 ) {
        filters[column] = function(x) {
          if(x)
            return (x.toString().toLowerCase().indexOf(filterText.toLowerCase()) > -1);
        };
      }
    }, this);

    var filteredItems = _.filter(this.state.items, function(item) {
      return _.some(columnNames, function(c) {
        return (!filters[c] || filters[c](item[c]));
      }, this);
    }, this);

    var sortedItems = _.sortBy(filteredItems, this.state.sort.column);
    if (this.state.sort.order === "desc") sortedItems.reverse();

    var cell = function(x) {
      return columnNames.map(function(c) {
        if (c == 'taken_at') {
          if (x[c])
            return <td>
              <span className="btn btn-shadow btn-danger" disabled="disabled">已領取</span>
            </td>;
          else
            return <td>
              <button name={x['_id']+','+x['staff_id']} className="btn btn-shadow btn-success" onClick={this.untake_prize}>未領取</button>
            </td>;
        }
        else if (c == 'can_accept_prize_now') {
          if (x[c] )
            return <td>
              <img src="/images/check.png"></img>
            </td>;
          else
            return <td>
              <img src="/images/cross.png"></img>
            </td>;
        }
        else
          return <td>{x[c]}</td>;
      }, this);
    }.bind(this);

    sortedItems.forEach(function(item) {
      rows.push(
        <tr key={item.id}>
          { cell(item) }
        </tr>
      );
    }.bind(this));


    var header = columnNames.map(function(c) {
      return <th >{this.state.columns[c].name}</th>;
    }, this);

    return (
      <div className="table">
        <input className="form-control  " placeholder="Search by anytext" 
               type="text" value={this.state.value} onChange={this.handleFilterTextChange}  />
      <table cellSpacing="0" className="table table-striped table-advance table-hover">
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
    );
  }
});


var App = React.createClass({
  render: function() {
    return (
      <div>
        <TableSorter dataSource={"/query/winner_list"} config={CONFIG} />
      </div>
    );
  }
});

if(document.getElementById("searchWinner")){
  
  ReactDOM.render(<App />, document.getElementById("searchWinner"));
}

