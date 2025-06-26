import React, { useState } from "react";
import "./LessonDetails.scss";

const encryptText = (text) => {
  try {
    return btoa(encodeURIComponent(text));
  } catch (error) {
    return text;
  }
};

const decryptText = (text) => {
  try {
    return decodeURIComponent(atob(text));
  } catch (error) {
    return text;
  }
};

const LessonDetails = ({
  examName,
  lessonName,
  initialQuestions,
  examStatus,
}) => {
  const [questions, setQuestions] = useState(
    initialQuestions.map((q) => ({
      id: q.id,
      question: encryptText(q.question),
      optionA: encryptText(q.optionA),
      optionB: encryptText(q.optionB),
      optionC: encryptText(q.optionC),
      optionD: encryptText(q.optionD),
      answer: encryptText(q.answer),
      level: q.level,
    })) || []
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
    level: "آسان",
  });

  const handleAddQuestion = (e) => {
    e.preventDefault();
    const newId = questions.length
      ? Math.max(...questions.map((q) => q.id)) + 1
      : 1;
    const questionToAdd = {
      id: newId,
      question: encryptText(newQuestion.question),
      optionA: encryptText(newQuestion.optionA),
      optionB: encryptText(newQuestion.optionB),
      optionC: encryptText(newQuestion.optionC),
      optionD: encryptText(newQuestion.optionD),
      answer: encryptText(newQuestion.answer),
      level: newQuestion.level,
    };
    setQuestions((prev) => [questionToAdd, ...prev]);
    setNewQuestion({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answer: "",
      level: "آسان",
    });
    setIsAddModalOpen(false);
  };

  const handleEditQuestion = (e) => {
    e.preventDefault();
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === currentQuestion.id
          ? {
              ...q,
              question: encryptText(newQuestion.question),
              optionA: encryptText(newQuestion.optionA),
              optionB: encryptText(newQuestion.optionB),
              optionC: encryptText(newQuestion.optionC),
              optionD: encryptText(newQuestion.optionD),
              answer: encryptText(newQuestion.answer),
              level: newQuestion.level,
            }
          : q
      )
    );
    setIsEditModalOpen(false);
    setCurrentQuestion(null);
    setNewQuestion({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answer: "",
      level: "آسان",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید این سؤال را حذف کنید؟")) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const openEditModal = (question) => {
    setCurrentQuestion(question);
    setNewQuestion({
      question: decryptText(question.question),
      optionA: decryptText(question.optionA),
      optionB: decryptText(question.optionB),
      optionC: decryptText(question.optionC),
      optionD: decryptText(question.optionD),
      answer: decryptText(question.answer),
      level: question.level,
    });
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setNewQuestion({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answer: "",
      level: "آسان",
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="lesson-details">
      <div className="lesson-details__info">
        <h3>
          {examName}/ <span>{lessonName}</span>
        </h3>
      </div>

      <div className="lesson-details__header">
        <button className="lesson-details__add-btn" onClick={openAddModal}>
          افزودن سؤال
        </button>
      </div>

      <table className="lesson-details__table">
        <thead>
          <tr>
            <th>عنوان سؤال</th>
            <th>گزینه الف</th>
            <th>گزینه ب</th>
            <th>گزینه ج</th>
            <th>گزینه د</th>
            <th>جواب</th>
            <th>سطح</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {questions.length > 0 ? (
            questions.map((item) => (
              <tr key={item.id}>
                <td>
                  {examStatus === "در دسترس"
                    ? decryptText(item.question)
                    : item.question}
                </td>
                <td>
                  {examStatus === "در دسترس"
                    ? decryptText(item.optionA)
                    : item.optionA}
                </td>
                <td>
                  {examStatus === "در دسترس"
                    ? decryptText(item.optionB)
                    : item.optionB}
                </td>
                <td>
                  {examStatus === "در دسترس"
                    ? decryptText(item.optionC)
                    : item.optionC}
                </td>
                <td>
                  {examStatus === "در دسترس"
                    ? decryptText(item.optionD)
                    : item.optionD}
                </td>
                <td>
                  {examStatus === "در دسترس"
                    ? decryptText(item.answer)
                    : item.answer}
                </td>
                <td>{item.level}</td>
                <td>
                  <div className="lesson-details__actions">
                    <button
                      className="lesson-details__action-btn lesson-details__action-btn--edit"
                      onClick={() => openEditModal(item)}
                    >
                      ویرایش
                    </button>
                    <button
                      className="lesson-details__action-btn lesson-details__action-btn--delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="lesson-details__table-cell--empty">
                سؤالی یافت نشد
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isAddModalOpen && (
        <div className="lesson-details__modal">
          <div className="lesson-details__modal-content">
            <h3>افزودن سؤال جدید</h3>
            <form onSubmit={handleAddQuestion}>
              <div className="lesson-details__modal-form-group">
                <label>عنوان سؤال</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>گزینه الف</label>
                <input
                  type="text"
                  value={newQuestion.optionA}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, optionA: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>گزینه ب</label>
                <input
                  type="text"
                  value={newQuestion.optionB}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, optionB: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>گزینه ج</label>
                <input
                  type="text"
                  value={newQuestion.optionC}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, optionC: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>گزینه د</label>
                <input
                  type="text"
                  value={newQuestion.optionD}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, optionD: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>جواب</label>
                <select
                  value={newQuestion.answer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, answer: e.target.value })
                  }
                  required
                >
                  <option value="">انتخاب کنید</option>
                  <option value="الف">الف</option>
                  <option value="ب">ب</option>
                  <option value="ج">ج</option>
                  <option value="د">د</option>
                </select>
              </div>
              <div className="lesson-details__modal-form-group">
                <label>سطح</label>
                <select
                  value={newQuestion.level}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, level: e.target.value })
                  }
                  required
                >
                  <option value="آسان">آسان</option>
                  <option value="متوسط">متوسط</option>
                  <option value="سخت">سخت</option>
                </select>
              </div>
              <div className="lesson-details__modal-form-actions">
                <button
                  type="submit"
                  className="lesson-details__modal-btn lesson-details__modal-btn--submit"
                >
                  افزودن
                </button>
                <button
                  type="button"
                  className="lesson-details__modal-btn lesson-details__modal-btn--cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="lesson-details__modal">
          <div className="lesson-details__modal-content">
            <h3>ویرایش سؤال</h3>
            <form onSubmit={handleEditQuestion}>
              <div className="lesson-details__modal-form-group">
                <label>عنوان سؤال</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>گزینه الف</label>
                <input
                  type="text"
                  value={newQuestion.optionA}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, optionA: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>گزینه ب</label>
                <input
                  type="text"
                  value={newQuestion.optionB}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, optionB: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>گزینه ج</label>
                <input
                  type="text"
                  value={newQuestion.optionC}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, optionC: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>گزینه د</label>
                <input
                  type="text"
                  value={newQuestion.optionD}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, optionD: e.target.value })
                  }
                  required
                />
              </div>
              <div className="lesson-details__modal-form-group">
                <label>جواب</label>
                <select
                  value={newQuestion.answer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, answer: e.target.value })
                  }
                  required
                >
                  <option value="">انتخاب کنید</option>
                  <option value="الف">الف</option>
                  <option value="ب">ب</option>
                  <option value="ج">ج</option>
                  <option value="د">د</option>
                </select>
              </div>
              <div className="lesson-details__modal-form-group">
                <label>سطح</label>
                <select
                  value={newQuestion.level}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, level: e.target.value })
                  }
                  required
                >
                  <option value="آسان">آسان</option>
                  <option value="متوسط">متوسط</option>
                  <option value="سخت">سخت</option>
                </select>
              </div>
              <div className="lesson-details__modal-form-actions">
                <button
                  type="submit"
                  className="lesson-details__modal-btn lesson-details__modal-btn--submit"
                >
                  ذخیره
                </button>
                <button
                  type="button"
                  className="lesson-details__modal-btn lesson-details__modal-btn--cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetails;
