<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponseTrait
{
    /**
     * Send a success response.
     *
     * @param mixed $data
     * @param string|null $message
     * @param int $code
     * @return JsonResponse
     */
    public function successResponse($data = [], ?string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Send an error response.
     *
     * @param string $message
     * @param int $code
     * @param array $errors
     * @return JsonResponse
     */
    public function errorResponse(string $message = 'Error', int $code = 400, array $errors = []): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    /**
     * Send a validation error response.
     *
     * @param array $errors
     * @param string|null $message
     * @return JsonResponse
     */
    public function validationErrorResponse(array $errors, ?string $message = 'Validation Error'): JsonResponse
    {
        return $this->errorResponse($message, 422, $errors);
    }

    /**
     * Send a not found response.
     *
     * @param string|null $message
     * @return JsonResponse
     */
    public function notFoundResponse(?string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Send an unauthorized response.
     *
     * @param string|null $message
     * @return JsonResponse
     */
    public function unauthorizedResponse(?string $message = 'Unauthorized'): JsonResponse
    {
        return $this->errorResponse($message, 401);
    }
}
