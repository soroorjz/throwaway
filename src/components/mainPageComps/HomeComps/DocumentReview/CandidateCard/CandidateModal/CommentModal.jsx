import React, { useState, useEffect } from "react";
import "./CommentModal.scss";

const CommentModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialComment = "",
  isReadOnly = false,
  title = "توضیحات خود را وارد کنید",
}) => {
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    setComment(initialComment);
  }, [initialComment]);

  if (!isOpen) return null;

  return (
    <div className="comment-modal__overlay">
      <div className="comment-modal__content">
        <h3 className="comment-modal__title">{title}</h3>
        <div className="comment-modal__body">
          {isReadOnly ? (
            <p className="comment-modal__text">
              {comment || "هیچ توضیحاتی ثبت نشده است."}
            </p>
          ) : (
            <textarea
              className="comment-modal__textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="توضیحات خود را وارد کنید..."
            />
          )}
        </div>
        <div className="comment-modal__footer">
          {isReadOnly ? (
            <button
              className="comment-modal__button comment-modal__button--close"
              onClick={onClose}
            >
              بستن
            </button>
          ) : (
            <>
              <button
                className="comment-modal__button comment-modal__button--submit"
                onClick={() => {
                  onSubmit(comment);
                  onClose();
                }}
              >
                ثبت
              </button>
              <button
                className="comment-modal__button comment-modal__button--cancel"
                onClick={onClose}
              >
                لغو
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
