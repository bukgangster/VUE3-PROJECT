<template>
  <div class="chat-container">
    <!-- 채팅 헤더 -->
    <div
      class="chat-header bg-primary text-white p-3 d-flex align-items-center"
      style="
        background: linear-gradient(to bottom, #1e3a78 60%, #ffc107 40%);
        border-radius: 12px 12px 0 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      "
    >
      <div>
        <h5 class="mb-0">해외 유학생 대학교 알아보기</h5>
      </div>
    </div>

    <!-- 채팅 내용 -->
    <div class="chat-body p-3" ref="chatBody" style="background-color: #f8f9fa">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'd-flex mb-3',
          message.sender === 'me'
            ? 'justify-content-end'
            : 'justify-content-start',
        ]"
      >
        <!-- 메시지 박스 -->
        <div
          class="response-area"
          :class="[
            'p-2 rounded',
            message.sender === 'me'
              ? 'bg-primary text-white'
              : 'bg-light text-dark',
          ]"
          style="max-width: 70%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"
        >
          {{ message.text }}
        </div>
      </div>
    </div>

    <!-- 채팅 입력 -->
    <div
      class="chat-footer p-3"
      style="
        background: linear-gradient(to bottom, #ffffff 60%, #f1f1f1 40%);
        border-radius: 0 0 12px 12px;
        box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
      "
    >
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          placeholder="메시지를 입력하세요..."
          v-model="newMessage"
          @keyup.enter="sendMessage"
          style="border: 1px solid #ddd; border-radius: 4px"
        />
        <button class="btn btn-primary" @click="sendMessage">전송</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { nextTick, ref, watch } from "vue";

export default {
  setup() {
    // 채팅 메시지 목록
    const messages = ref([
      {
        id: 1,
        text: "안녕하세요! 티반 브레인이에요.\n현재 고려대학교, 남서울대학교, 서강대학교, 성균관대학교, 연세대학교, 전남대학교 데이터만 저장이 되어있어요.",
        sender: "other",
        time: "오전 10:00",
      },
    ]);

    const newMessage = ref(""); // 새 메시지 입력값
    const chatBody = ref(null);

    // 메시지 전송 함수
    const sendMessage = () => {
      if (newMessage.value.trim() !== "") {
        pushMessage(newMessage.value, "me");
        getSmlData();
      }
    };

    const getSmlData = async () => {
      try {
        const param = {
          queryMsg: newMessage.value,
        };
        const res = await axios.post(
          `https://43.203.214.173:5300/lang/getVectorRetrieverChain`,
          param
        );
        console.log(res);
        pushMessage(res.data.data, "other");

        newMessage.value = "";
        nextTick(() => {
          scrollToBottom();
        });
      } catch (err) {
        console.log(err);
      }
    };

    const pushMessage = (message, sender) => {
      messages.value.push({
        id: messages.value.length + 1,
        text: message.replace("\\n", "<br/>"),
        sender: sender,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    };

    const scrollToBottom = () => {
      if (chatBody.value) {
        chatBody.value.scrollTop = chatBody.value.scrollHeight;
      }
    };

    watch(messages, () => {
      scrollToBottom();
    });

    return {
      messages,
      newMessage,
      chatBody,

      sendMessage,
      scrollToBottom,
      getSmlData,
    };
  },
};
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chat-header {
  flex-shrink: 0;
  padding: 1rem;
}

.chat-body {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chat-footer {
  flex-shrink: 0;
  padding: 1rem;
}

.response-area {
  white-space: pre-wrap; /* \n을 줄바꿈으로 처리 */
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>
