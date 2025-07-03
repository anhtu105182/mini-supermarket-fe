<template>
  <div class="orders-page">
    <div class="orders-header">
      <h1 class="orders-title">Danh sách đơn đặt hàng nhập</h1>
      <!-- <div class="export-file" @click="showExportModal = true">Xuất file</div> -->
    </div>
    <div class="orders-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th><div class="skeleton-header"></div></th>
            <th><div class="skeleton-header"></div></th>
            <th><div class="skeleton-header"></div></th>
            <th><div class="skeleton-header"></div></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 3" :key="i">
            <td><div class="skeleton-row"></div></td>
            <td><div class="skeleton-row"></div></td>
            <td><div class="skeleton-row"></div></td>
            <td><div class="skeleton-row"></div></td>
            <td><div class="skeleton-row"></div></td>
          </tr>
        </tbody>
      </table>
      <EmptyState
        icon="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
        title="Cửa hàng của bạn chưa có đơn đặt hàng nhập nào"
        description="Thêm mới hoặc nhập danh sách đơn đặt hàng nhập"
      >
        <template #actions>
          <button class="orders-add-btn-import" @click="showExportModal = true">
            <i class="fa-solid fa-upload"></i>Nhập file
          </button>
          <button class="orders-add-btn">
            <i class="fa fa-plus-circle"></i> Tạo đơn đặt hàng
          </button>
        </template>
      </EmptyState>
    </div>
    <div class="orders-footer">
      Tìm hiểu về <a href="#" class="orders-link">vận đơn </a>
    </div>
    <!-- Modal Nhập file -->
    <div
      v-if="showExportModal"
      class="modal-overlay"
      @click.self="showExportModal = false"
    >
      <div class="modal-import">
        <div class="modal-header">
          <span>Nhập file danh sách đơn đặt hàng nhập</span>
          <button class="modal-close" @click="showExportModal = false">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-row">
            <div class="modal-field">
              <label>Chi nhánh tạo đơn</label>
              <select v-model="selectedBranch">
                <option value="">Chọn chi nhánh</option>
                <option v-for="b in branches" :key="b" :value="b">
                  {{ b }}
                </option>
              </select>
            </div>
            <div class="modal-field">
              <label>Nhà cung cấp</label>
              <select v-model="selectedSupplier">
                <option value="">Chọn nhà cung cấp</option>
                <option v-for="s in suppliers" :key="s" :value="s">
                  {{ s }}
                </option>
              </select>
            </div>
          </div>
          <div
            class="modal-dropzone"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div class="modal-dropzone-content">
              <i
                class="fa fa-cloud-upload"
                style="font-size: 2.2rem; color: #2196f3"
              ></i>
              <div>
                Kéo thả file vào đây hoặc
                <label class="modal-upload-label">
                  <input
                    type="file"
                    style="display: none"
                    @change="handleFileChange"
                  />
                  <span class="modal-upload-link">tải lên từ thiết bị</span>
                </label>
              </div>
              <div class="modal-dropzone-desc">
                (Tối đa 3MB, định dạng .xls hoặc .xlsx)
              </div>
              <div v-if="fileName" class="modal-file-name">
                <i class="fa fa-file-excel" style="color: #43a047"></i>
                {{ fileName }}
              </div>
            </div>
          </div>
          <div class="modal-sample-link">
            <a href="#" @click.prevent="downloadSample">
              <i class="fa fa-download"></i> Tải file dữ liệu mẫu
            </a>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="showExportModal = false">
            Hủy
          </button>
          <button
            class="modal-btn import"
            :disabled="!fileName"
            @click="importFile"
          >
            Nhập file
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EmptyState from "@/components/EmptyState.vue";
import { ref } from "vue";
const showExportModal = ref(false);
const selectedBranch = ref("");
const selectedSupplier = ref("");
const fileName = ref("");
const branches = ["Chi nhánh 1", "Chi nhánh 2"];
const suppliers = ["Nhà cung cấp A", "Nhà cung cấp B"];

function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) fileName.value = file.name;
}
function handleDrop(e) {
  const file = e.dataTransfer.files[0];
  if (file) fileName.value = file.name;
}
function downloadSample() {
  // Tải file mẫu, có thể thay bằng đường dẫn thực tế
  window.open("/sample.xlsx", "_blank");
}
function importFile() {
  // Xử lý nhập file ở đây
  showExportModal.value = false;
  fileName.value = "";
}
</script>

<style scoped>
.orders-page {
  padding: 24px 16px 0 16px;
  background: #f7f7f9;
  min-height: 100vh;
}
.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.export-file {
  background: #2196f3;
  color: #fff;
  padding: 8px 16px;
  margin-right: 30px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  transition: background 0.2s;
}
.export-file:hover {
  background: #1976d2;
}
.orders-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 18px;
  color: #222;
  margin-top: 0px;
}
.orders-table {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 24px 0 48px 0;
  min-height: 500px;
  position: relative;
}
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 32px;
}
th,
td {
  padding: 8px 0;
}
.skeleton-header {
  height: 18px;
  width: 120px;
  background: #f0f1f3;
  border-radius: 6px;
  opacity: 0.5;
}
.skeleton-row {
  height: 16px;
  width: 100px;
  background: #f0f1f3;
  border-radius: 6px;
  opacity: 0.3;
}
.orders-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.orders-empty-img {
  width: 72px;
  margin-bottom: 16px;
  opacity: 0.95;
}
.orders-empty-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: #222;
  text-align: center;
}
.orders-empty-desc {
  color: #888;
  margin-bottom: 18px;
  text-align: center;
}
.orders-empty-actions {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 16px;
}
.orders-add-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 22px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  transition: background 0.2s;
}
.orders-add-btn:hover {
  background: #1976d2;
}
.orders-add-btn-import {
  background: #fbfdff;
  color: #2196f3;
  border: none;
  border-radius: 6px;
  padding: 10px 22px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  transition: background 0.2s;
  border: 1px solid #2196f3;
}
.orders-footer {
  text-align: right;
  margin-top: 18px;
  color: #888;
  font-size: 0.97rem;
  display: flex;
  justify-content: center;
}
.orders-link {
  color: #2196f3;
  text-decoration: underline;
}
/* Modal styles */
.modal-overlay {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-import {
  background: #fff;
  border-radius: 10px;
  min-width: 520px;
  max-width: 98vw;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.13);
  padding: 0;
  animation: modalIn 0.18s;
  display: flex;
  flex-direction: column;
}
@keyframes modalIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 28px 10px 28px;
  font-size: 1.18rem;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  margin-left: 10px;
}
.modal-body {
  padding: 18px 28px 0 28px;
}
.modal-row {
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
}
.modal-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.modal-field label {
  font-weight: 500;
  margin-bottom: 2px;
  color: #222;
}
.modal-field select {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #dbe3ea;
  font-size: 1rem;
  background: #fafbfc;
}
.modal-dropzone {
  border: 2px dashed #b5c6d6;
  border-radius: 8px;
  background: #f7fafd;
  padding: 32px 0;
  text-align: center;
  margin-bottom: 12px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.modal-dropzone:hover {
  border-color: #2196f3;
}
.modal-dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.modal-upload-label {
  color: #2196f3;
  cursor: pointer;
  font-weight: 500;
}
.modal-upload-link {
  color: #2196f3;
  text-decoration: underline;
  cursor: pointer;
}
.modal-dropzone-desc {
  color: #888;
  font-size: 0.97rem;
}
.modal-file-name {
  margin-top: 6px;
  color: #43a047;
  font-size: 0.98rem;
  display: flex;
  align-items: center;
  gap: 6px;
}
.modal-sample-link {
  margin: 12px 0 0 0;
}
.modal-sample-link a {
  color: #2196f3;
  text-decoration: underline;
  font-size: 0.97rem;
  display: flex;
  align-items: center;
  gap: 6px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 18px 28px 18px 28px;
  border-top: 1px solid #f0f0f0;
  background: #fafbfc;
  border-radius: 0 0 10px 10px;
}
.modal-btn {
  min-width: 80px;
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-btn.cancel {
  background: #fff;
  color: #2196f3;
  border: 1px solid #2196f3;
}
.modal-btn.import {
  background: #2196f3;
  color: #fff;
  border: none;
}
.modal-btn.import:disabled {
  background: #b5c6d6;
  color: #fff;
  cursor: not-allowed;
}
.modal-btn.import:hover:enabled {
  background: #1976d2;
}
</style>
