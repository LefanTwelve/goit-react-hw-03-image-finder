import axios from 'axios';

export default function fetchImagesWithQuery(searchQuery, page) {
    const response = axios.get(
        `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=34301666-92c958cb6db814ea462c82786&image_type=photo&orientation=horizontal&per_page=12`
    );
    return response;
}
