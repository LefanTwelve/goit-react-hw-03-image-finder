import { Component } from "react";
import fetchImagesWithQuery from "pixabay api/api";
import s from '.App.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export class App extends Component {
  state = {
    searchData: '',
    images: [],
    page: 0,
    largeImage: '',
    showModal: false,
    isLoading: false,
    error: null,
    totalImages: 0,
    isMoreBtnHide: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevPage = prevState.page;
    const prevSearchData = prevState.searchData;
    const { searchData, page } = this.state;
    if (prevPage !== page || prevSearchData !== searchData) {
      this.setState({ isLoading: true });
      const response = fetchImagesWithQuery(searchData, page);
      response
        .then(({ data }) => {
          if (data.hits.length < 12) {
            this.setState({ isMoreBtnHide: true });
          }
          if (data.total === 0) {
            this.setState({ isLoading: false });
            return toast.info('Sorry, nothing was found for your search');
          }
          const normalizedImages = data.hits.map(
            ({ id, webformatURL, largeImageURL }) => ({
              id,
              webformatURL,
              largeImageURL,
            })
          );
          this.setState(({ images }) => ({
            images: [...images, ...normalizedImages],
            totalImages: data.totalHits,
          }));
        })
        .catch(error => {
          this.setState({ error });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  render() {
  // const { toggleModal, openModal, onSubmit } = this;
  // const { images, isLoading, largeImage, showModal, isMoreBtnHide } = this.state;

  return (
    <div className={s.App}>
      <ToastContainer autoClose={2500}/>
      
    </div>
  );
}
} 

