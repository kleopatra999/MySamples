var React = require('react');
var _ = require('underscore');

var DragItem = React.createClass({
    drag: function(ev) {
        ev.dataTransfer.setData("draggedItem", JSON.stringify(this.props.item));
    },
    render: function () {
        return (<div draggable="true" onDragStart={this.drag} className="item">{this.props.item.text}</div>);
    }
});

var DragContainer = React.createClass({
    allowDrop: function(ev) {
        ev.preventDefault();
    },
    drop: function(ev) {
        ev.preventDefault();
        var droppedItem = JSON.parse(ev.dataTransfer.getData("draggedItem"));
        this.props.onUserDrop(this.props.myId, droppedItem);
    },
    getInitialState: function() {
        return {myItems: this.props.items};
    },
    render: function () {
        var rows = [];
        var lastCategory = null;
        if (this.state.myItems) {
            this.state.myItems.map(function (item) {
                rows.push(<DragItem item={item} />);
            });
        }
        return (
            <div className="container" onDragOver={this.allowDrop} onDrop={this.drop}>
                {rows}
            </div>
            );
    }
});

var DragPanel = React.createClass({
    getInitialState: function() {
        return {
            items : this.props.items
        };
    },
    handleUserDrop: function(id, item) {
        var targetList = this.state.items[id];
        var sourceList = (id == "left") ? this.state.items["right"] : this.state.items["left"];

        if(!_.findWhere(targetList, item))
            targetList.push(item);
        var index = sourceList.indexOf(_.findWhere(sourceList, item));
        if (index > -1) {
            sourceList.splice(index, 1);
        }
        this.forceUpdate();
    },
    render: function () {
        return (
            <div className="panel">
                <DragContainer myId="left" onUserDrop={this.handleUserDrop} items={this.state.items.left} />
                <DragContainer myId="right" onUserDrop={this.handleUserDrop} items={this.state.items.right} />
            </div>
            );
    }
});

var ITEMS = {
    left: [
        {text: "One"},
        {text: "Two"},
        {text: "Three"}
    ],
    right: []
};

React.renderComponent(<DragPanel items={ITEMS} />, document.getElementById('main'));