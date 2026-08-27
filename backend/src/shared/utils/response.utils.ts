export class ResponseUtils {
  static success(data: unknown, message = "Success") {
    return { success: true, message, data };
  }

  static error(message = "Error", data: unknown = null) {
    return { success: false, message, data };
  }
}
