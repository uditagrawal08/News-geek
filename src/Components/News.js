    import React, { Component } from 'react';
    import NewsItem from './NewsItem';
    import Spinner from './Spinner';
    import PropTypes from 'prop-types'
    import InfiniteScroll from 'react-infinite-scroll-component';

    class News extends Component {
        static defaultProps = {
            country: 'in',
            pageSize: 5,
            category: 'sports',
            totalResults: 0
        }
        static propTypes = {
            country: PropTypes.string,
            pageSize: PropTypes.number,
            category: PropTypes.string,

        }
        constructor(props) {
            super(props);
            this.state = {
                articles: [],
                loading: false,
                page: 1
            };
            document.title = `${props.category} - Nerd News`;
        }



        async update() {
            try {
                this.props.setProgress(0);
                const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=${this.state.page}&pagesize=${this.props.pageSize}`; //`https://newsapi.org/v2/top-headlines?country=${this.props.country}&${this.props.category}&apiKey=45b6ff74da
                this.setState({ loading: true });
                const response = await fetch(url);
                const data = await response.json();
                console.log(data); // Log the response data to see its structure
                this.props.setProgress(50);
                if (data.status === 'ok') {
                    this.setState({ articles: data.articles });
                    this.setState({ totalResults: data.totalResults });
                    this.setState({ loading: false });
                    this.setState({totalResults: data.totalResults})
                } else {
                    console.error("Failed to fetch news articles");
                }
            } catch (error) {
                console.error("Error fetching news articles:", error);
            }
            this.props.setProgress(100);

        }

        async componentDidMount() {
            this.setState({ page: 1 });
            this.update();
        }


        // handleprev = async () => {
            
        //     this.setState({ page: this.state.page - 1 });
        //     this.update();

        // }

        // handlenext = async () => {
            
        //     this.setState({ page: this.state.page + 1 });
        //     this.update();

        // }

        fetchMoreData = async () => {
            try {
                const nextPage = this.state.page + 1; // Increment the page number
                const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=${nextPage}&pagesize=${this.props.pageSize}`;
                this.setState({ loading: true });
                const response = await fetch(url);
                const data = await response.json();
        
                if (data.status === 'ok') {
                    // Concatenate new articles with existing ones
                    this.setState(prevState => ({
                        articles: [...prevState.articles, ...data.articles],
                        totalResults: data.totalResults,
                        loading: false,
                        page: nextPage // Update the page number in state
                    }));
                } else {
                    console.error("Failed to fetch news articles");
                }
            } catch (error) {
                console.error("Error fetching news articles:", error);
            }
        };
        

        render() {
            const { articles } = this.state;

            return (
                    console.log(this.props.category),
                <div className='container my-3'>
                    <h1 className='text-centre'>Top headlines from {this.props.category}</h1>
                    {/* {this.state.loading && <Spinner />} */}
                    <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length!==this.state.totalResults}
            loader={<Spinner/>}
            >
                <div className="container">
                    

                    <div className="row justify-content-around">
                        {articles.map((article, index) => (
                            <div className="col-md-4" key={index}>
                                <NewsItem
                                    title={article.title.slice(0, 45)}
                                    description={article.description ? article.description.slice(0, 55) : ""}
                                    imageUrl={article.urlToImage ? article.urlToImage : "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"}
                                    newsUrl={article.url}
                                    author={article.author ? article.author : "Unknown"}
                                    date={article.publishedAt}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </InfiniteScroll>
    {/* 
                    <div className='container d-flex justify-content-around'>
                        <button disabled={this.state.page <= 1} type="button" className="btn btn-outline-primary" onClick={this.handleprev}>&larr; Previous</button>
                        <button disabled={this.state.page >= Math.ceil(this.state.totalResults / this.state.pageSize)} type="button" className="btn btn-outline-secondary" onClick={this.handlenext}>Next &rarr;</button>

                    </div> */}
                </div>
            );
        }
    }

    export default News;
