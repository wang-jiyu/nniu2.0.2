var Advert = require('../../../../components/common/Advert');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="advertisement_live_box">
                <h6 className="title">
                    广告
                </h6>
                <Advert position="6" />
            </div>
        );
    }
});