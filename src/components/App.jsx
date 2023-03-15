import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import fetchImagesWithQuery from 'pixabay api/api';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import s from './App.module.css';
import { Component } from 'react';
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

  onSubmit = searchData => {
    if (searchData.trim() === '') {
      return toast.error('Enter the meaning for search');
    } else if (searchData === this.state.searchData) {
      return;
    }
    this.setState({
      searchData: searchData,
      page: 1,
      images: [],
      isLoading: true,
      isMoreBtnHide: false,
    });
  };

  
  handleMoreSearch = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
      isLoading: true,
    }));
  };
  openModal = index => {
    this.setState(({ images }) => ({
      showModal: true,
      largeImage: images[index].largeImageURL,
    }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  render() {
    const { toggleModal, openModal, onSubmit } = this;
    const { images, isLoading, largeImage, showModal, isMoreBtnHide } =
      this.state;

    return (
      <div className={s.App}>
        <Searchbar onSubmit={onSubmit} />
        {images.length !== 0 && (
          <ImageGallery images={images} openModal={openModal} />
        )}
        {showModal && (
          <Modal toggleModal={toggleModal} largeImage={largeImage} />
        )}
        {isLoading && <Loader />}
        <ToastContainer autoClose={2500} />
        {images.length > 0 && !isLoading && !isMoreBtnHide && (
          <Button onClick={this.handleMoreSearch} />
        )}
      </div>
    );
  }
}

