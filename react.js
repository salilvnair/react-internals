class ReactDOMComponent {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const domElement = document.createElement(this._currentElement.type);
        const text = this._currentElement.props.children;
        const textNode = document.createTextNode(text);
        domElement.appendChild(textNode);
        container.appendChild(domElement);
        this._hostNode = domElement;
        return domElement;
    }
}

class ReactCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const Component = this._currentElement.type;
        const componentInstance = new Component(this._currentElement.props);
        let element = componentInstance.render();

        while (typeof element.type === 'function') {
            element = (new element.type(element.props)).render();
        }

        const domComponentInstance = new ReactDOMComponent(element);
        return domComponentInstance.mountComponent(container);
    }
}

const TopLevelWrapper = function(props) {
    this.props = props;
};

TopLevelWrapper.prototype.render = function() {
    return this.props;
};


const React = {
    createClass(spec) {
        function Constructor(props) {
            this.props = props;
        }

        Constructor.prototype.render = spec.render;

        return Constructor;
    }, 
    createElement(type, props, children) {
        const element = {
            type,
            props: props || {}
        };

        if (children) {
            element.props.children = children;
        }

        return element;
    },

    render(element, container) {
        // const componentInstance = new ReactDOMComponent(element);
        // return componentInstance.mountComponent(container);

        // const componentInstance = new ReactCompositeComponentWrapper(element);
        // return componentInstance.mountComponent(container);
        const wrapperElement = this.createElement(TopLevelWrapper, element);
        const componentInstance = new ReactCompositeComponentWrapper(wrapperElement);
        return componentInstance.mountComponent(container);
    }
};

// React.render(
//     React.createElement('h1', null, 'Hello React Internals!'),
//     document.getElementById('root')
// );

const MyTitle = React.createClass({
    render() {
        return React.createElement('h1', null, this.props.message);
    }
});

const MyMessage = React.createClass({
    render() {
        if (this.props.asTitle) {
            return React.createElement(MyTitle, {
                message: this.props.message
            });
        } else {
            return React.createElement('p', null, this.props.message);
        }
    }
});

// React.render(
//     React.createElement(MyTitle, { message: 'Custom Title of React'} ),
//     document.getElementById('root')
// );


React.render(
    React.createElement('h1', null, 'React Internals primitive HTML elements!'),
    document.getElementById('root')
);

React.render(
    React.createElement(MyMessage, { message: 'Custom react element with message prop', asTitle:true } ),
    document.getElementById('root')
);