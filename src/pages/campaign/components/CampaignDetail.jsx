import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import Tag from './Tag';
import Activites from './Activites';
import SideBar from './Sidebar';
import { useParams } from 'react-router-dom';

const CampaignDetail = ({ campaign }) => {
  const { id } = useParams()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Swiper for Image Slider */}
          <div className="mb-6">
            <Swiper
              slidesPerView={1}  // Number of slides to show
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              loop
            >
              {campaign.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image.image_url}
                    alt={`${campaign.title} image ${index + 1}`}
                    className="w-full rounded-lg aspect-video object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>

          <div className="mb-6">
            <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mr-2">
              {campaign.category?.title || "No Category"}
            </span>
            <span className="text-gray-600 text-sm">
              by <strong>{campaign.owner.first_name}</strong>
            </span>
          </div>
          {/* Tags */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Tags</h2>
            <div className="flex flex-wrap">
              {campaign.tags.map((tag, index) => (
                <Tag key={index} label={tag} />
              ))}
            </div>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <h2 className="text-xl font-bold mb-4">About this project</h2>
            <p className="text-gray-700 whitespace-pre-line">{campaign.details}</p>
          </div>

          {/* Comment Section */}
          <Activites comments={campaign.comments} ratings={campaign.ratings} donations={campaign.donations} id={id} />
        </div>

        {/* Sidebar */}
        <SideBar campaign={campaign} />
      </div>
    </div>
  );
};

export default CampaignDetail;
